import { Result } from "@/utility/result";
import { Validation } from "@/utility/validation";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { RequestRepository } from "@/repositories/request-repository";

type Props = {
  requestRepository: RequestRepository;
};

type Input = {
  id: string;
  requestId: string;
  sessionId: string;
};

export class DeleteRequestItemService {
  protected _requestRepository: RequestRepository;

  public constructor(props: Props) {
    this._requestRepository = props.requestRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const requestId = Attribute.make(input.requestId);
    const id = Attribute.make(input.id);

    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const requestIdValidationRule = Validation.make(requestId.get())
      .mandatory()
      .string()
      .getRule();
    if (requestIdValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const requestRecord = await this._requestRepository.get(requestId.get());

    if (!requestRecord) {
      return Result.fail(Failure.notFound());
    }

    const itemToDelete = requestRecord.items.find(
      (item) => item.itemId === id.get(),
    );

    if (!itemToDelete) {
      return Result.fail(Failure.notFound());
    }

    if (!(await this._requestRepository.itemExist(String(itemToDelete._id)))) {
      return Result.fail(Failure.notFound());
    }

    await this._requestRepository.deleteItem(String(itemToDelete._id));

    requestRecord.items = requestRecord.items.filter(
      (item) => item.itemId !== id.get(),
    );

    requestRecord.totalPrice -= itemToDelete.totalPrice;
    requestRecord.isApproved = false;
    requestRecord.isRefused = false;
    if (requestRecord.totalPrice === 0) requestRecord.paymentStatus = "None";
    await this._requestRepository.Update(requestRecord);

    return Result.ok(id.get());
  }
}
