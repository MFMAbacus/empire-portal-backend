import { Attribute } from "@/utility/attribute";
import { ValidationBag } from "@/utility/validation-bag";

type Record = {
  [name: string]: unknown;
};

type Attributes = {
  [name: string]: Attribute<unknown>;
};

export abstract class Model {
  protected _attributes: Attributes;

  protected constructor(attributes: Attributes) {
    this._attributes = attributes;
  }

  public get<Type = unknown>(key: string): Type {
    const attribute = this._get(key);
    return attribute.get() as Type;
  }

  public getRecord<Type>(): Type {
    const record: Record = {};

    for (const name in this._attributes) {
      if (!Object.hasOwnProperty.call(this._attributes, name)) {
        continue;
      }
      record[name] = this._attributes[name].get();
    }

    return record as Type;
  }

  public set<Type = unknown>(key: string, value: Type): Model {
    const attribute = this._get(key);

    attribute.set(value);

    return this;
  }

  public hasChanged(key: string): boolean {
    const attribute = this._get(key);
    return attribute.hasChanged();
  }

  public abstract validate(): ValidationBag;

  protected static _makeAttributes<Record>(record: Record): Attributes {
    const attributes: Attributes = {};

    for (const key in record) {
      if (!Object.hasOwnProperty.call(record, key)) {
        continue;
      }

      attributes[key] = Attribute.make(record[key]);
    }

    return attributes;
  }

  protected _get<Type = unknown>(key: string): Attribute<Type> {
    const attribute = this._attributes[key];

    if (typeof attribute === "undefined") {
      throw new Error(`Model attribute not found: ${key}`);
    }
    return attribute as Attribute<Type>;
  }
}
