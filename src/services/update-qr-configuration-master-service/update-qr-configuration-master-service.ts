import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { QRConfigurationMasterModel } from "@/models/qr-configuration-master-model";
import { QRConfigurationMasterRepository } from "@/repositories/qr-configuration-master-repository";

type Props = {
  qrConfigurationMasterRepository: QRConfigurationMasterRepository;
};

type Input = {
  id?: string;             // Database primary key ID (e.g., "QR-12345")
  qrConfigId?: string;     // Auto-generated Config ID (e.g., "QRC-101")
  expiryHours?: number;
  isOneTimeScan?: boolean;
  isGateValidation?: boolean;
  isPdfRequired?: boolean;
  isActive?: boolean;
};

export class UpdateQRConfigurationMasterService {
  protected _qrConfigurationMasterRepository: QRConfigurationMasterRepository;

  public constructor(props: Props) {
    this._qrConfigurationMasterRepository = props.qrConfigurationMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to qrConfigId
    const targetId = input.id || input.qrConfigId;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._qrConfigurationMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    const isOneTimeScan =
      typeof input.isOneTimeScan !== "undefined"
        ? Boolean(input.isOneTimeScan)
        : record.isOneTimeScan;

    const isGateValidation =
      typeof input.isGateValidation !== "undefined"
        ? Boolean(input.isGateValidation)
        : record.isGateValidation;

    const isPdfRequired =
      typeof input.isPdfRequired !== "undefined"
        ? Boolean(input.isPdfRequired)
        : record.isPdfRequired;

    const expiryHours =
      typeof input.expiryHours !== "undefined"
        ? Number(input.expiryHours)
        : record.expiryHours;

    // Re-construct & validate with Model before saving
    const qrConfigModel = QRConfigurationMasterModel.make({
      id: targetId,
      qrConfigId: input.qrConfigId || record.qrConfigId,
      expiryHours,
      isOneTimeScan,
      isGateValidation,
      isPdfRequired,
      isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = qrConfigModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = qrConfigModel.getRecord();
    await this._qrConfigurationMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}