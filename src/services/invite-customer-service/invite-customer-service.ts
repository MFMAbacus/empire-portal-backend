import { Result } from "@/utility/result";
import { Validation } from "@/utility/validation";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Mailer } from "@/utility/mailer";

import { CustomerModel } from "@/models/customer-model";
import { CustomerRepository } from "@/repositories/customer-repository";

type Props = {
  customerRepository: CustomerRepository;
};

type Input = {
  id: string;
};

export class InviteCustomerService {
  protected _customerRepository: CustomerRepository;

  public constructor(props: Props) {
    this._customerRepository = props.customerRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const id = Attribute.make(input.id);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const customerRecord = await this._customerRepository.get(id.get());
    if (typeof customerRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const customerModel = CustomerModel.make(customerRecord);
    customerModel.invite();

    const validationBag = customerModel.validate();

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    await this._customerRepository.Update(customerModel.getRecord());

    if (customerRecord.email) {
      Mailer.sendMail({
        to: customerRecord.email,
        subject: "Mobile Application Invitation (Auto-sending)",
        html,
        text,
      });
    }

    return Result.ok(customerModel.get("id"));
  }
}

/* eslint-disable max-len */
const html = `
Dear Valued Client,<br />

We are glad to inform you that we&apos;ve launched our mobile application.<br />
<br />
You can easily download the application through Google Play store / Apple Store, or through the below links:<br />
Android version: <a href="https://play.google.com/store/apps/details?id=com.abacuscambridge.empireworldErbil&hl=en">Click Here</a><br />
IOS version: <a href="https://apps.apple.com/gb/app/empire-world-erbil/id6499267349">Click Here</a><br />
<br />
Should you have any difficulties, please pay the service center a visit to solve the issue.<br />
<br />
Empire World Management<br />
+964 750 271 3838<br />
+964 750 271 3939
`;

const text = `
Dear Valued Client,

We are glad to inform you that we&apos;ve launched our mobile application.

You can easily download the application through Google Play store / Apple Store, or through the below links:
Android version: Click Here
IOS version: Click Here

Should you have any difficulties, please pay the service center a visit to solve the issue.

Empire World Management
+964 750 271 3838
+964 750 271 3939
`;
/* eslint-enable max-len */
