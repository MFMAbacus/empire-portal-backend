import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { DeliverySLAMasterModel } from "@/models/delivery-sla-master-model";
import { DeliverySLAMasterRepository } from "@/repositories/delivery-sla-master-repository";

type Props = {
  deliverySLAMasterRepository: DeliverySLAMasterRepository;
};

export type Input = {
  id?: string;               // Database Primary Key (Edit mode me hi aayega)
  deliveryPeriodHours: string;   
  projectCode: string;
  isActive?: boolean;
};

export class CreateDeliverySLAMasterService {
  protected _deliverySLAMasterRepository: DeliverySLAMasterRepository;

  public constructor(props: Props) {
    this._deliverySLAMasterRepository = props.deliverySLAMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Sirf tab chalega jab DB ki primary key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._deliverySLAMasterRepository.get(input.id);
      if (existing) {
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.deliveryPeriodHours = input.deliveryPeriodHours || existing.deliveryPeriodHours;
        existing.isActive = isActive;

        await this._deliverySLAMasterRepository.Update(existing);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Jab Naya Record banega tab DB ki primary key 'DSC' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("DSC");

    const deliverySLAModel = DeliverySLAMasterModel.make({
      id: primaryKeyId,               // Database Primary Key -> DSC-12345
      deliveryPeriodHours: input.deliveryPeriodHours,
      projectCode: input.projectCode,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = deliverySLAModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = deliverySLAModel.getRecord();
    await this._deliverySLAMasterRepository.Create(record as any);

    return Result.ok(deliverySLAModel.get("id"));
  }
}