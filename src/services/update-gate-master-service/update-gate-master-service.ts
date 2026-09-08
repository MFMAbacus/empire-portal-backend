import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { GateMasterModel } from "@/models/gate-master-model";
import { GateMasterRepository } from "@/repositories/gate-master-repository";

type Props = {
  gateMasterRepository: GateMasterRepository;
};

type Input = {
  id?: string;             // Database primary key ID (e.g., "1")
  gateId: string;     // User Input Code (e.g., "APT-101")
  gateName: string;
  location: string;
  projectCode: string;
  isActive?: boolean;
};

export class UpdateGateMasterService {
  protected _gateMasterRepository: GateMasterRepository;

  public constructor(props: Props) {
    this._gateMasterRepository = props.gateMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to user input gateId
    const targetId = input.id || input.gateId;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._gateMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Re-construct & validate with Model before saving
    const gateModel = GateMasterModel.make({
      id: targetId,
      gateId: input.gateId || record.gateId,
      gateName: input.gateName || record.gateName,
      location: input.location || record.location,
      projectCode: input.projectCode || record.projectCode,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = gateModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = gateModel.getRecord();
    await this._gateMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}