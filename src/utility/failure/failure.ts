import { ValidationBag } from "@/utility/validation-bag";

type Props = {
  code: string;
  data?: unknown;
};

export class Failure {
  protected _code: string;
  protected _data: unknown;

  protected constructor(props: Props) {
    this._code = props.code;
    this._data = props.data;
  }

  public static make(props: Props): Failure {
    const failure = new Failure(props);
    return failure;
  }

  public static badRequest(data: unknown = undefined): Failure {
    const failure = new Failure({
      code: "bad-request",
      data,
    });
    return failure;
  }

  public static notFound(): Failure {
    const failure = new Failure({
      code: "not-found",
    });
    return failure;
  }

  public static unauthorized(): Failure {
    const failure = new Failure({
      code: "unauthorized",
    });
    return failure;
  }

  public static customerNotFound(): Failure {
    const failure = new Failure({
      code: "customer-not-found",
    });
    return failure;
  }

  public static valueIsAlreadyUsed(): Failure {
    const failure = new Failure({
      code: "customer-already-exist",
    });
    return failure;
  }

  public static staffNotFound(): Failure {
    const failure = new Failure({
      code: "staff-not-found",
    });
    return failure;
  }

  public static invalidOtp(): Failure {
    const failure = new Failure({
      code: "invalid-otp",
    });
    return failure;
  }

  public static invalidToken(): Failure {
    const failure = new Failure({
      code: "invalid-token",
    });
    return failure;
  }

  public static validation(validationBag: ValidationBag): Failure {
    const failure = new Failure({
      code: "validation",
      data: validationBag.present(),
    });
    return failure;
  }

  public static customerNotInvited(): Failure {
    const failure = new Failure({
      code: "customer-not-invited",
    });
    return failure;
  }

  public static customerBlocked(): Failure {
    const failure = new Failure({
      code: "customer-blocked",
    });
    return failure;
  }

  public static customerNotActivated(): Failure {
    const failure = new Failure({
      code: "customer-not-activated",
    });
    return failure;
  }

  public static invalidCredentials(): Failure {
    const failure = new Failure({
      code: "invalid-credentials",
    });
    return failure;
  }

  public static paymentFailed(): Failure {
    const failure = new Failure({
      code: "payment-failed",
    });
    return failure;
  }

  public getCode(): string {
    return this._code;
  }

  public getData<Data = unknown>(): Data {
    return this._data as Data;
  }
}
