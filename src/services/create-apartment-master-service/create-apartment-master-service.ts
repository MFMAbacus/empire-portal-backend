import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { ApartmentMasterModel } from "@/models/aparment-master-model";
import { ApartmentMasterRepository } from "@/repositories/apartment-master-repository";

type Props = {
  apartmentMasterRepository: ApartmentMasterRepository;
};

type Input = {
  id?: string;               // Database Primary Key (Edit mode me hi aayega)
  apartmentId: string;       // User Input Code (e.g. "APT-101")
  apartmentNo: string;
  buildingOrTower: string;
  floor: string;
  projectCode: string;
  isActive?: boolean;
};

export class CreateApartmentMasterService {
  protected _apartmentMasterRepository: ApartmentMasterRepository;

  public constructor(props: Props) {
    this._apartmentMasterRepository = props.apartmentMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Sirf tab chalega jab DB ki primary key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._apartmentMasterRepository.get(input.id);
      if (existing) {
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.apartmentId = input.apartmentId || existing.apartmentId;
        existing.apartmentNo = input.apartmentNo || existing.apartmentNo;
        existing.floor = input.floor || existing.floor;
        existing.buildingOrTower = input.buildingOrTower || existing.buildingOrTower;
        existing.isActive = isActive;

        await this._apartmentMasterRepository.Update(existing);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Jab Naya Record banega tab DB ki primary key 'AM' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("AM");

    const apartmentModel = ApartmentMasterModel.make({
      id: primaryKeyId,              // Database Primary Key -> AM-12345
      apartmentId: input.apartmentId, // User Input -> APT-101
      projectCode: input.projectCode,
      apartmentNo: input.apartmentNo,
      floor: input.floor,
      buildingOrTower: input.buildingOrTower,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = apartmentModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = apartmentModel.getRecord();
    await this._apartmentMasterRepository.Create(record as any);

    return Result.ok(apartmentModel.get("id"));
  }
}