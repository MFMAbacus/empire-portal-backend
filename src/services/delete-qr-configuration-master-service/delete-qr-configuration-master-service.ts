import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { QRConfigurationMasterRepository } from "@/repositories/qr-configuration-master-repository";

type Props = {
  qrConfigurationMasterRepository: QRConfigurationMasterRepository;
};

type Input = {
  id?: string;
  qrConfigId?: string;
  isRestore?: boolean | string;
};

export class DeleteQRConfigurationMasterService {
  protected _qrConfigurationMasterRepository: QRConfigurationMasterRepository;

  public constructor(props: Props) {
    this._qrConfigurationMasterRepository = props.qrConfigurationMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.qrConfigId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._qrConfigurationMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._qrConfigurationMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}