import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { GateMasterModel } from "@/models/gate-master-model";
import { GateMasterRepository } from "@/repositories/gate-master-repository";

type Props = {
  gateMasterRepository: GateMasterRepository;
};

type Input = {
  id?: string;               // Database Primary Key (Edit mode me hi aayega)
  gateId: string;       // User Input Code (e.g. "APT-101")
  gateName: string;
  location: string;
  projectCode: string;
  isActive?: boolean;
};

export class CreateGateMasterService {
  protected _gateMasterRepository: GateMasterRepository;

  public constructor(props: Props) {
    this._gateMasterRepository = props.gateMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Sirf tab chalega jab DB ki primary key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._gateMasterRepository.get(input.id);
      if (existing) {
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.gateId = input.gateId || existing.gateId;
        existing.gateName = input.gateName || existing.gateName;
        existing.location = input.location || existing.location;
        existing.isActive = isActive;

        await this._gateMasterRepository.Update(existing);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Jab Naya Record banega tab DB ki primary key 'AM' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("GM");

    const gateModel = GateMasterModel.make({
      id: primaryKeyId,              // Database Primary Key -> AM-12345
      gateId: input.gateId, // User Input -> APT-101
      projectCode: input.projectCode,
      gateName: input.gateName,
      location: input.location,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = gateModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = gateModel.getRecord();
    await this._gateMasterRepository.Create(record as any);

    return Result.ok(gateModel.get("id"));
  }
}