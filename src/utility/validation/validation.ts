import {ValidationRule} from '@/utility/validation-rule';

type StringOptions = {
  pattern?: RegExp | string;
  fixedLength?: number;
  minLength?: number;
  maxLength?: number;
};

export class Validation {
  protected _value: unknown;
  protected _rule: ValidationRule;
  protected _isSkipped = false;

  protected constructor(value: unknown) {
    this._value = value;
    this._rule = ValidationRule.success();
    this._isSkipped = false;
  }

  public static make(value: unknown): Validation {
    const validator = new Validation(value);
    return validator;
  }

  public mandatory(): Validation {
    if (this._isStopped()) {
      return this;
    }
    if (typeof this._value === 'undefined' || this._value === null) {
      this._rule = ValidationRule.valueIsMissing();
    }
    return this;
  }

  public optional(): Validation {
    if (this._isStopped()) {
      return this;
    }
    if (typeof this._value === 'undefined' || this._value === null) {
      this._isSkipped = true;
    }
    return this;
  }

  public boolean(): Validation {
    if (this._isStopped()) {
      return this;
    }
    if (typeof this._value !== 'boolean') {
      this._rule = ValidationRule.valueIsNotABoolean();
    }
    return this;
  }

  public number(): Validation {
    if (this._isStopped()) {
      return this;
    }
    if (typeof this._value !== 'number' || Number.isNaN(this._value)) {
      this._rule = ValidationRule.valueIsNotANumber();
    }
    return this;
  }

  public array(): Validation {
    if (this._isStopped()) {
      return this;
    }
    if (!Array.isArray(this._value)) {
      this._rule = ValidationRule.valueIsNotAnArray();
    }
    return this;
  }

  public string(options: StringOptions = {}): Validation {
    if (this._isStopped()) {
      return this;
    }

    const {
      pattern,
      fixedLength,
      minLength,
      maxLength,
    } = options;

    if (typeof this._value !== 'string') {
      this._rule = ValidationRule.valueIsNotAString();
      return this;
    }

    if (typeof pattern !== 'undefined' && !this._value.match(pattern)) {
      this._rule = ValidationRule.stringDoesNotMatchPattern(String(pattern));
      return this;
    }

    if (typeof fixedLength !== 'undefined') {
      if (this._value.length !== fixedLength) {
        this._rule = ValidationRule.stringHasIncorrectLength(fixedLength);
      }
      return this;
    }

    if (typeof minLength !== 'undefined' && this._value.length < minLength) {
      this._rule = ValidationRule.stringIsTooShort(minLength);
      return this;
    }

    if (typeof maxLength !== 'undefined' && this._value.length > maxLength) {
      this._rule = ValidationRule.stringIsTooLong(maxLength);
      return this;
    }

    return this;
  }

  public date(): Validation {
    return this.string({
      pattern: dateRegex,
    });
  }

  public time(): Validation {
    return this.string({
      pattern: timeRegex,
    });
  }

  public getRule(): ValidationRule {
    return this._rule;
  }

  protected _isStopped(): boolean {
    return this._rule.isError() || this._isSkipped;
  }
}

const dateRegex = /^(19|20)\d\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
