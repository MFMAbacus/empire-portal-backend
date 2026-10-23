import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { ResidentMasterModel } from "@/models/resident-master-model";
import { ResidentMasterRepository } from "@/repositories/resident-master-repository";
import { Customer } from "@/schemas/customer-schema/cutomer-schema";

type Props = {
  residentMasterRepository: ResidentMasterRepository;
};

type Input = {
  id?: string;           // Database Primary Key (Edit mode me)
  residentId?: string;   // Unique Resident Code
  name: string;
  email: string;
  mobileNo?: string;     // Primitive string
  loginUserId?: string;
  residentType: string;
  apartmentId: string;
  projectCode: string;
  isActive?: boolean;
};

export class CreateResidentMasterService {
  protected _residentMasterRepository: ResidentMasterRepository;

  public constructor(props: Props) {
    this._residentMasterRepository = props.residentMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Jab Primary Key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._residentMasterRepository.get(input.id);
      if (existing) {
        existing.residentId = input.residentId || existing.residentId;
        existing.name = input.name || existing.name;
        existing.email = input.email || existing.email;
        existing.mobileNo = input.mobileNo ?? existing.mobileNo;
        existing.loginUserId = input.loginUserId || existing.loginUserId;
        existing.residentType = input.residentType || existing.residentType;
        existing.apartmentId = input.apartmentId || existing.apartmentId;
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.isActive = isActive;

        await this._residentMasterRepository.Update(existing as any);

        // Update case: loginUserId ho to customer ka isResident = true karo
        const updatedLoginUserId = input.loginUserId || existing.loginUserId;
        if (updatedLoginUserId && updatedLoginUserId.trim() !== "") {
          try {
            await Customer.updateOne(
              { id: updatedLoginUserId.trim() },
              { $set: { isResident: true } }
            );
          } catch (e) {
            // ignore
          }
        }

        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Naya record banne par Primary Key 'RM' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("RM");

    let finalResidentId = input.residentId;
    
    if (!finalResidentId || finalResidentId.trim() === "") {
      const nextSeqNumber = await this._residentMasterRepository.getNextResidentId();
      const numericPart = typeof nextSeqNumber === "number" 
        ? nextSeqNumber 
        : parseInt(nextSeqNumber.replace(/\D/g, "")) || 1;

      const paddedNumber = String(numericPart).padStart(6, "0");
      finalResidentId = `RES-${paddedNumber}`;
    }
    const residentModel = ResidentMasterModel.make({
      id: primaryKeyId,
      residentId: finalResidentId,
      name: input.name,
      email: input.email,
      mobileNo: input.mobileNo ?? "",
      loginUserId: input.loginUserId || "",
      residentType: input.residentType,
      apartmentId: input.apartmentId,
      projectCode: input.projectCode,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = residentModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = residentModel.getRecord();
    await this._residentMasterRepository.Create(record as any);

    // Agar loginUserId hai to Customer ka isResident = true kar do
    if (input.loginUserId && input.loginUserId.trim() !== "") {
      try {
        await Customer.updateOne(
          { id: input.loginUserId.trim() },
          { $set: { isResident: true } }
        );
      } catch (e) {
        // ignore - customer update fail hone se resident creation block na ho
      }
    }

    return Result.ok(residentModel.get("id"));
  }
}