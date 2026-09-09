import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IQRConfigurationMaster } from "@/schemas/qr-configuration-master-schema";
import { QRConfigurationMasterRepository } from "@/repositories/qr-configuration-master-repository";

type Props = {
  qrConfigurationMasterRepository: QRConfigurationMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleQRConfigurationMasterService {
  protected _qrConfigurationMasterRepository: QRConfigurationMasterRepository;

  public constructor(props: Props) {
    this._qrConfigurationMasterRepository = props.qrConfigurationMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IQRConfigurationMaster, Failure>> {
    const property = await this._qrConfigurationMasterRepository.get(input.id);
    if (!property) {
      return Result.fail(Failure.notFound());
    }

    const doc = typeof (property as any).toObject === "function" ? (property as any).toObject() : { ...property };
    const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;

    return Result.ok({
      ...doc,
      isActive,
    } as any);
  }
}