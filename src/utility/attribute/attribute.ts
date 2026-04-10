export class Attribute<Value> {
  protected _value: Value;
  protected _hasChanged: boolean;

  protected constructor(value: Value) {
    this._value = value;
    this._hasChanged = false;
  }

  public static make<Value>(value: Value): Attribute<Value> {
    const attribute = new Attribute(value);
    return attribute;
  }

  public set(newValue?: Value): Attribute<Value> {
    if (typeof newValue !== "undefined" && newValue !== this._value) {
      this._value = newValue;
      this._hasChanged = true;
    }
    return this;
  }

  public get(): Value {
    return this._value;
  }

  public hasChanged(): boolean {
    return this._hasChanged;
  }
}
