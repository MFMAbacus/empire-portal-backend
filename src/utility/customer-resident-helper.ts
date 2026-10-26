import ResidentMaster from "@/schemas/resident-master-schema";
import { Customer } from "@/schemas/customer-schema/cutomer-schema";
import ApartmentMaster from "@/schemas/apartment-master-schema";
import PropertyMaster from "@/schemas/property-master-schema";

export async function findResidentByCustomerCode(customerIdentifier: string) {
  if (!customerIdentifier || typeof customerIdentifier !== "string" || customerIdentifier.trim() === "") {
    return null;
  }

  const cleanIdentifier = customerIdentifier.trim();

  // 1. Try to find the Customer document first to get all their details
  let customer: any = null;
  try {
    customer = await Customer.findOne({
      $or: [
        { id: cleanIdentifier },
        { username: cleanIdentifier },
        { email: cleanIdentifier },
        { phoneNumber: cleanIdentifier },
      ],
    }).lean();
  } catch (e) {
    // ignore
  }

  // 2. Build search conditions for ResidentMaster
  const conditions: any[] = [
    { loginUserId: cleanIdentifier },
    { residentId: cleanIdentifier },
    { id: cleanIdentifier },
  ];

  if (customer) {
    if (customer.id && customer.id !== cleanIdentifier) {
      conditions.push({ loginUserId: customer.id });
      conditions.push({ residentId: customer.id });
      conditions.push({ id: customer.id });
    }
    if (customer.username && customer.username !== cleanIdentifier) {
      conditions.push({ loginUserId: customer.username });
      conditions.push({ residentId: customer.username });
    }
    if (customer.email && customer.email.trim() !== "") {
      conditions.push({ email: customer.email.trim() });
    }
    if (customer.phoneNumber) {
      const num = parseInt(customer.phoneNumber.replace(/\D/g, ""), 10);
      if (!isNaN(num) && num > 0) {
        conditions.push({ mobileNo: num });
      }
    }
  } else {
    // If no customer record found with that id, identifier might be a numeric phone number
    const num = parseInt(cleanIdentifier.replace(/\D/g, ""), 10);
    if (!isNaN(num) && num > 0) {
      conditions.push({ mobileNo: num });
    }
    // Or identifier might be an email
    if (cleanIdentifier.includes("@")) {
      conditions.push({ email: cleanIdentifier });
    }
  }

  // 3. Find resident in ResidentMaster
  let resident: any = null;
  try {
    resident = await ResidentMaster.findOne({
      $or: conditions,
      isArchived: false,
      isActive: true,
    }).lean();

    if (!resident) {
      resident = await ResidentMaster.findOne({
        $or: conditions,
        isArchived: false,
        isActive: true,
      }).lean();
    }
  } catch (e) {
    console.error("Error finding resident:", e);
  }

  if (!resident) {
    return null;
  }

  // If customer found and not marked as resident, update customer.isResident to true
  if (customer && !customer.isResident) {
    try {
      await Customer.updateOne({ _id: customer._id }, { $set: { isResident: true } });
    } catch (e) {
      // ignore
    }
  }

  // 4. Enrich with ApartmentMaster and Property details
  let apartmentDetails: any = null;
  if (resident.apartmentId) {
    try {
      apartmentDetails = await ApartmentMaster.findOne({
        $or: [{ apartmentId: resident.apartmentId }, { id: resident.apartmentId }],
        isArchived: false,
      }).lean();
    } catch (e) {
      // ignore
    }
  }

  let propertyDetails: any = null;
  if (resident.projectCode) {
    try {
      propertyDetails = await PropertyMaster.findOne({
        $or: [{ projectCode: resident.projectCode }, { id: resident.projectCode }],
        isArchived: false,
      }).lean();
    } catch (e) {
      // ignore
    }
  }

  return {
    id: resident.id,
    residentId: resident.residentId,
    name: resident.name,
    email: resident.email,
    mobileNo: resident.mobileNo,
    loginUserId: resident.loginUserId,
    residentType: resident.residentType,
    apartmentId: resident.apartmentId,
    apartmentNo: apartmentDetails?.apartmentNo || resident.apartmentId,
    buildingOrTower: apartmentDetails?.buildingOrTower || "",
    floor: apartmentDetails?.floor || "",
    projectCode: resident.projectCode,
    projectName: propertyDetails?.projectName || resident.projectCode,
    isActive: resident.isActive,
    isArchived: resident.isArchived,
  };
}
