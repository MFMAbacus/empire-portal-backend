type Props<Value, Failure> = {
  value: Value | null;
  failure: Failure | null;
  hasFailed: boolean;
};

export class Result<Value, Failure> {
  protected _value: Value | null;
  protected _failure: Failure | null;
  protected _hasFailed: boolean;

  protected constructor(props: Props<Value, Failure>) {
    this._value = props.value;
    this._failure = props.failure;
    this._hasFailed = props.hasFailed;
  }

  public static ok<Value, Failure>(value: Value): Result<Value, Failure> {
    const result = new Result<Value, Failure>({
      value,
      failure: null,
      hasFailed: false,
    });
    return result;
  }

  public static fail<Value, Failure>(failure: Failure): Result<Value, Failure> {
    const result = new Result<Value, Failure>({
      value: null,
      failure,
      hasFailed: true,
    });
    return result;
  }

  public getValue(): Value {
    if (this._hasFailed) {
      throw new Error('Cannot get a value from a failed result');
    }
    return this._value as Value;
  }

  public getFailure(): Failure {
    if (!this._hasFailed) {
      throw new Error('Cannot get a failure from a successfull result');
    }
    return this._failure as Failure;
  }

  public hasFailed(): boolean {
    return this._hasFailed;
  }
}
