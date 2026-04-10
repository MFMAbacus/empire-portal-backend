import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ValidationRule } from "@/utility/validation-rule";
import { ValidationBag } from "@/utility/validation-bag";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { Generator } from "@/utility/generator";
import { DateTime } from "@/utility/date-time";

import {
  IRequestItemRecord,
  RequestItem,
  RequestUpdate,
} from "@/schemas/request-schema";
import { SessionRecord } from "@/records/session-record";
import { RequestRepository } from "@/repositories/request-repository";

import { getTokensByUserId } from "@/data/clients-sessions";
import NotificationFCM from "@/utility/notification/notification";
import { transactionService } from "../transaction-service";

type Props = {
  requestRepository: RequestRepository;
};

type RequestItem = {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  totalPrice: number;
};

type Input = {
  id: string;
  items: RequestItem[];
  sessionRecord: SessionRecord;
};

export class SetRequestItemsService {
  protected _requestRepository: RequestRepository;

  public constructor(props: Props) {
    this._requestRepository = props.requestRepository;
  }

  public async execute(input: Input): Promise<Result<undefined, Failure>> {
    const id = Attribute.make(input.id);

    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const requestRecord = await this._requestRepository.get(id.get());
    if (typeof requestRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    if (input.sessionRecord.role === "customer") {
      if (input.sessionRecord.userId !== requestRecord.customerId) {
        return Result.fail(Failure.unauthorized());
      }
    }

    const validationBag = ValidationBag.make();
    const requestItems: IRequestItemRecord[] = [];
    let totalRequestPrice = 0;

    if (!input.items) {
      validationBag.set("items", ValidationRule.valueIsMissing());
    } else if (!Array.isArray(input.items)) {
      validationBag.set("items", ValidationRule.valueIsNotAnArray());
    } else {
      for (let i = 0; i < input.items.length; i++) {
        const item = input.items[i];
        const itemId = Attribute.make(item.itemId);
        const itemName = Attribute.make(item.itemName);
        const quantity = Attribute.make<number>(Number(item.quantity));
        const price = Attribute.make<number>(Number(item.price));
        const totalPrice = Attribute.make<number>(Number(item.totalPrice));

        validationBag.set(
          `itemId.${i}`,
          Validation.make(itemId.get()).mandatory().string().getRule()
        );
        validationBag.set(
          `itemName.${i}`,
          Validation.make(itemName.get()).mandatory().string().getRule()
        );
        validationBag.set(
          `quantity.${i}`,
          Validation.make(quantity.get()).mandatory().number().getRule()
        );
        validationBag.set(
          `price.${i}`,
          Validation.make(price.get()).mandatory().number().getRule()
        );
        validationBag.set(
          `totalPrice.${i}`,
          Validation.make(totalPrice.get()).mandatory().number().getRule()
        );
        if (!validationBag.hasError(`quantity.${i}`)) {
          if (quantity.get() < 1) {
            validationBag.set(`quantity.${i}`, ValidationRule.valueIsInvalid());
          }
        }
        if (!validationBag.hasError(`price.${i}`)) {
          if (price.get() < 0) {
            validationBag.set(`price.${i}`, ValidationRule.valueIsInvalid());
          }
        }
        if (!validationBag.hasError(`totalPrice.${i}`)) {
          if (totalPrice.get() < 0) {
            validationBag.set(
              `totalPrice.${i}`,
              ValidationRule.valueIsInvalid()
            );
          }
        }

        const existingItem = requestRecord.items.find(
          (existingItem) => existingItem.itemId === itemId.get()
        );

        if (existingItem) {
          existingItem.name = itemName.get();
          existingItem.quantity = quantity.get();
          existingItem.price = price.get();
          existingItem.totalPrice = totalPrice.get();

          const data = await RequestItem.findOneAndUpdate(
            { _id: existingItem._id },
            {
              name: existingItem.name,
              quantity: existingItem.quantity,
              price: existingItem.price,
              totalPrice: existingItem.totalPrice,
            },
            { new: true }
          );
        } else {
          const updateData = new RequestItem({
            itemId: itemId.get(),
            name: itemName.get(),
            quantity: quantity.get(),
            price: price.get(),
            totalPrice: totalPrice.get(),
          });

          requestItems.push(updateData);
        }

        totalRequestPrice += totalPrice.get();
      }
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    requestRecord.totalPrice = totalRequestPrice;
    requestRecord["paymentStatus"] = "Unpaid";
    requestRecord.isApproved = false;
    requestRecord.isRefused = false;

    await this._requestRepository.Update(
      requestRecord,
      requestItems,
      RequestItem,
      "items"
    );

    const updateData = new RequestUpdate({
      id: Generator.shortToken(),
      userId: input.sessionRecord.userId,
      userName: `${input.sessionRecord.firstName} ${input.sessionRecord.lastName}`,
      type: "items-set",
      date: DateTime.now().toString(),
    });

    await this._requestRepository.Update(
      requestRecord,
      updateData,
      RequestUpdate,
      "updates"
    );

    await transactionService.logRequestItemsSet(requestRecord);

    const customerTokens = await getTokensByUserId(requestRecord.customerId);

    if (customerTokens.length > 0) {
      await NotificationFCM.getInstance().sendToMany(
        {
          messageId: Generator.id(),
          title: "Request Items Updated",
          body: `Dear ${requestRecord.customerName},
      Items in request ${requestRecord.id} have been updated.`,
          id: requestRecord.id,
          type: "request",
        },
        customerTokens
      );
    }

    return Result.ok(undefined);
  }
}
