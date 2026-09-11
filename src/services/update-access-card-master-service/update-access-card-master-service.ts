import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { AccessCardMasterModel } from "@/models/access-card-master-model";
import { AccessCardMasterRepository } from "@/repositories/access-card-master-repository";

type Props = {
  accessCardMasterRepository: AccessCardMasterRepository;
};

type Input = {
  id?: string;             // Database record ID
  cardId: string;          // Unique Access Card Identifier
  serialNo?: string;
  maskedSerial?: string;
  issueDate?: string;
  cardStatus?: string;
  projectCode?: string;
  apartmentId?: string;
  residentId?: string;
  isActive?: boolean;
};

export class UpdateAccessCardMasterService {
  protected _accessCardMasterRepository: AccessCardMasterRepository;

  public constructor(props: Props) {
    this._accessCardMasterRepository = props.accessCardMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to cardId
    const targetId = input.id || input.cardId;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    // Existing record fetch kar rahe hain
    const record = await this._accessCardMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Serial number change hone par maskedSerial update logic
    const serialNo = input.serialNo || record.serialNo;
    let maskedSerial = input.maskedSerial || record.maskedSerial;

    if (input.serialNo && !input.maskedSerial) {
      if (serialNo.length > 4) {
        maskedSerial = "X".repeat(serialNo.length - 4) + serialNo.slice(-4);
      } else {
        maskedSerial = serialNo;
      }
    }

    // Model me access card fields map aur validate kar rahe hain
    const accessCardModel = AccessCardMasterModel.make({
      id: targetId,
      cardId: input.cardId || record.cardId,
      serialNo: serialNo,
      maskedSerial: maskedSerial,
      issueDate: input.issueDate || record.issueDate,
      cardStatus: input.cardStatus || record.cardStatus,
      projectCode: input.projectCode || record.projectCode,
      apartmentId: input.apartmentId || record.apartmentId,
      residentId: input.residentId || record.residentId,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = accessCardModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = accessCardModel.getRecord();
    await this._accessCardMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}