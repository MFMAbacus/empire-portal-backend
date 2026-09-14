import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IDeliverySLAMaster } from "@/schemas/delivery-sla-master-schema";
import { SessionRecord } from "@/records/session-record";
import { DeliverySLAMasterRepository } from "@/repositories/delivery-sla-master-repository";

type Props = {
  deliverySLAMasterRepository: DeliverySLAMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetDeliverySLAMasterService {
  protected _deliverySLAMasterRepository: DeliverySLAMasterRepository;

  public constructor(props: Props) {
    this._deliverySLAMasterRepository = props.deliverySLAMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IDeliverySLAMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const coordinators = await this._deliverySLAMasterRepository.getAll({ isArchived });

    const mappedCoordinators = coordinators.map((item) => {
      const doc = typeof (item as any).toObject === "function" ? (item as any).toObject() : { ...item };
      const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;
      return {
        ...doc,
        isActive,
      };
    });

    return Result.ok(mappedCoordinators as any);
  }
}