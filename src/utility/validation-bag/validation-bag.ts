import {
  PresentedValidationRule,
  ValidationRule,
} from '@/utility/validation-rule';

type Rules = {
  [key: string]: ValidationRule;
};

export type PresentedValidationBag = {
  [key: string]: PresentedValidationRule;
};

export class ValidationBag {
  protected _rules: Rules;
  protected _hasErrors: boolean;

  protected constructor() {
    this._rules = {};
    this._hasErrors = false;
  }

  public static make() {
    const validationBag = new ValidationBag();
    return validationBag;
  }

  public set(key: string, rule: ValidationRule): ValidationBag {
    if (rule.isError()) {
      this._rules[key] = rule;
      this._hasErrors = true;
    }
    return this;
  }

  public hasError(key: string): boolean {
    if (typeof this._rules[key] === 'undefined') {
      return false;
    }
    return this._rules[key].isError();
  }

  public hasErrors(): boolean {
    return this._hasErrors;
  }

  public present(): PresentedValidationBag {
    const result: PresentedValidationBag = {};
    for (const key in this._rules) {
      if (!Object.hasOwnProperty.call(this._rules, key)) {
        continue;
      }
      result[key] = this._rules[key].present();
    }
    return result;
  }
}
