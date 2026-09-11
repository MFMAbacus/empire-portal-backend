import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { AccessCardMasterModel } from "@/models/access-card-master-model";
import { AccessCardMasterRepository } from "@/repositories/access-card-master-repository";

type Props = {
  accessCardMasterRepository: AccessCardMasterRepository;
};

type Input = {
  id?: string;           // Database Primary Key (Edit mode me)
  cardId?: string;       // Unique Access Card Code
  serialNo: string;
  maskedSerial?: string;
  issueDate: string;
  cardStatus?: string;
  projectCode: string;
  apartmentId: string;
  residentId: string;
  isActive?: boolean;
};

export class CreateAccessCardMasterService {
  protected _accessCardMasterRepository: AccessCardMasterRepository;

  public constructor(props: Props) {
    this._accessCardMasterRepository = props.accessCardMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // Masked serial calculation if not explicitly provided
    let maskedSerial = input.maskedSerial;
    if (!maskedSerial && input.serialNo) {
      if (input.serialNo.length > 4) {
        maskedSerial = "X".repeat(input.serialNo.length - 4) + input.serialNo.slice(-4);
      } else {
        maskedSerial = input.serialNo;
      }
    }

    // UPDATE LOGIC (Jab Primary Key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._accessCardMasterRepository.get(input.id);
      if (existing) {
        existing.cardId = input.cardId || existing.cardId;
        existing.serialNo = input.serialNo || existing.serialNo;
        existing.maskedSerial = maskedSerial || existing.maskedSerial;
        existing.issueDate = input.issueDate || existing.issueDate;
        existing.cardStatus = input.cardStatus || existing.cardStatus;
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.apartmentId = input.apartmentId || existing.apartmentId;
        existing.residentId = input.residentId || existing.residentId;
        existing.isActive = isActive;

        await this._accessCardMasterRepository.Update(existing as any);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Naya record banne par Primary Key 'ACM' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("ACM");
    const cardId = input.cardId || Generator.id("CARD");

    const accessCardModel = AccessCardMasterModel.make({
      id: primaryKeyId,
      cardId: cardId,
      serialNo: input.serialNo,
      maskedSerial: maskedSerial || "",
      issueDate: input.issueDate,
      cardStatus: input.cardStatus || "Active",
      projectCode: input.projectCode,
      apartmentId: input.apartmentId,
      residentId: input.residentId,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = accessCardModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = accessCardModel.getRecord();
    await this._accessCardMasterRepository.Create(record as any);

    return Result.ok(accessCardModel.get("id"));
  }
}