import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IDeliverySLAMaster } from "@/schemas/delivery-sla-master-schema";
import { DeliverySLAMasterRepository } from "@/repositories/delivery-sla-master-repository";

type Props = {
  deliverySLAMasterRepository: DeliverySLAMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleDeliverySLAMasterService {
  protected _deliverySLAMasterRepository: DeliverySLAMasterRepository;

  public constructor(props: Props) {
    this._deliverySLAMasterRepository = props.deliverySLAMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IDeliverySLAMaster, Failure>> {
    const record = await this._deliverySLAMasterRepository.get(input.id);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const doc = typeof (record as any).toObject === "function" ? (record as any).toObject() : { ...record };
    const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;

    return Result.ok({
      ...doc,
      isActive,
    } as any);
  }
}