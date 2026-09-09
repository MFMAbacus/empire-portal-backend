import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IQRConfigurationMaster } from "@/schemas/qr-configuration-master-schema";
import { SessionRecord } from "@/records/session-record";
import { QRConfigurationMasterRepository } from "@/repositories/qr-configuration-master-repository";

type Props = {
  qrConfigurationMasterRepository: QRConfigurationMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetQRConfigurationMasterService {
  protected _qrConfigurationMasterRepository: QRConfigurationMasterRepository;

  public constructor(props: Props) {
    this._qrConfigurationMasterRepository = props.qrConfigurationMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IQRConfigurationMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._qrConfigurationMasterRepository.getAll({ isArchived });

    const mappedProperties = properties.map((item) => {
      const doc = typeof (item as any).toObject === "function" ? (item as any).toObject() : { ...item };
      const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;
      return {
        ...doc,
        isActive,
      };
    });

    return Result.ok(mappedProperties as any);
  }
}