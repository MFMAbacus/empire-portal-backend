import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { DeliverySLAMasterModel } from "@/models/delivery-sla-master-model";
import { DeliverySLAMasterRepository } from "@/repositories/delivery-sla-master-repository";

type Props = {
  deliverySLAMasterRepository: DeliverySLAMasterRepository;
};

type Input = {
  id?: string;              // Database primary key ID
  deliveryPeriodHours: string;
  projectCode: string;
  isActive?: boolean;
};

export class UpdateDeliverySLAMasterService {
  protected _deliverySLAMasterRepository: DeliverySLAMasterRepository;

  public constructor(props: Props) {
    this._deliverySLAMasterRepository = props.deliverySLAMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._deliverySLAMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Re-construct & validate with DeliverySLAMasterModel before saving
    const deliverySLAModel = DeliverySLAMasterModel.make({
      id: targetId,
      deliveryPeriodHours: input.deliveryPeriodHours || record.deliveryPeriodHours,
      projectCode: input.projectCode || record.projectCode,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = deliverySLAModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = deliverySLAModel.getRecord();
    await this._deliverySLAMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}