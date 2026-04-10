type Props = {
  code: string;
  data?: unknown;
};

export type PresentedValidationRule = {
  code: string;
  data?: unknown;
};

export class ValidationRule {
  protected _code: string;
  protected _data: unknown;

  protected constructor(props: Props) {
    this._code = props.code;
    this._data = props.data;
  }

  public static success(): ValidationRule {
    const validation = new ValidationRule({
      code: 'success',
    });
    return validation;
  }

  public static valueIsMissing(): ValidationRule {
    const validation = new ValidationRule({
      code: 'value-is-missing',
    });
    return validation;
  }

  public static valueIsNotABoolean(): ValidationRule {
    const validation = new ValidationRule({
      code: 'value-is-not-a-boolean',
    });
    return validation;
  }

  public static valueIsNotANumber(): ValidationRule {
    const validation = new ValidationRule({
      code: 'value-is-not-a-number',
    });
    return validation;
  }

  public static valueIsNotAnArray(): ValidationRule {
    const validation = new ValidationRule({
      code: 'value-is-not-an-array',
    });
    return validation;
  }

  public static valueIsNotAString(): ValidationRule {
    const validation = new ValidationRule({
      code: 'value-is-not-a-string',
    });
    return validation;
  }

  public static stringDoesNotMatchPattern(pattern: string): ValidationRule {
    const validation = new ValidationRule({
      code: 'string-does-not-match-pattern',
      data: {
        pattern,
      },
    });
    return validation;
  }

  public static stringHasIncorrectLength(fixedLength: number): ValidationRule {
    const validation = new ValidationRule({
      code: 'string-has-incorrect-length',
      data: {
        fixedLength,
      },
    });
    return validation;
  }

  public static stringIsTooShort(minLength: number): ValidationRule {
    const validation = new ValidationRule({
      code: 'string-is-too-short',
      data: {
        minLength,
      },
    });
    return validation;
  }

  public static stringIsTooLong(maxLength: number): ValidationRule {
    const validation = new ValidationRule({
      code: 'string-is-too-long',
      data: {
        maxLength,
      },
    });
    return validation;
  }

  public static valueIsAlreadyUsed(): ValidationRule {
    const validation = new ValidationRule({
      code: 'value-is-already-used',
    });
    return validation;
  }

  public static valueIsInvalid(data: unknown = undefined): ValidationRule {
    const validation = new ValidationRule({
      code: 'value-is-invalid',
      data,
    });
    return validation;
  }

  public isSuccess(): boolean {
    return this._code === 'success';
  }

  public isError(): boolean {
    return this._code !== 'success';
  }

  public getCode(): string {
    return this._code;
  }

  public getData<Data = unknown>(): Data {
    return this._data as Data;
  }

  public present(): PresentedValidationRule {
    const result: PresentedValidationRule = {
      code: this._code,
    };
    if (typeof this._data !== 'undefined') {
      result.data = this._data;
    }
    return result;
  }
}
