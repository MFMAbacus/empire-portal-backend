import { Model, Document } from "mongoose";

export abstract class MongoRepository<T extends Document> {
  protected _model: Model<T>;

  public constructor(model: Model<T>) {
    this._model = model;
  }

  public async getAll(filter: any = {}, schemaNames?: string[]): Promise<T[]> {
    const query = this._model.find(filter);

    if (schemaNames && schemaNames.length > 0) {
      schemaNames.forEach((schemaName) => {
        query.populate(schemaName);
      });
    }
    query.sort({ _id: -1 });
    return await query.exec();
  }

  public async Find(filter: any = {}): Promise<T[]> {
    return await this._model.find(filter).sort({ _id: -1 });
  }

  public async FindOne(
    filter: any = {},
    schemaNames?: string[]
  ): Promise<T | undefined> {
    const query = this._model.findOne(filter);
    if (schemaNames && schemaNames.length > 0) {
      schemaNames.forEach((schemaName) => {
        query.populate(schemaName);
      });
    }

    const result = await query.exec();

    return result || undefined;
  }

  public async get(id: string, schemaNames?: string[]): Promise<T | undefined> {
    const query = this._model.findOne({ id });
    if (schemaNames && schemaNames.length > 0) {
      schemaNames.forEach((schemaName) => {
        query.populate(schemaName);
      });
    }
    const result = await query.exec();
    return result ?? undefined;
  }

  public async create(record: T): Promise<T> {
    const createdDocument = await new this._model(record).save();
    return createdDocument;
  }

  public async _update(record: Partial<T>): Promise<T | undefined> {
    const result = await this._model
      .findByIdAndUpdate({ _id: record._id }, record, { new: true })
      .exec();

    return result ?? undefined;
  }

  public async update(record: Partial<T>): Promise<T | undefined> {
    const result = await this._model
      .findOneAndUpdate({ id: record.id }, record, { new: true })
      .exec();

    return result ?? undefined;
  }

  public async _delete(id: string): Promise<void> {
    await this._model.findByIdAndDelete(id).exec();
  }

  public async delete(id: string): Promise<T | null> {
    return await this._model.findOneAndDelete({ id: id }).exec();
  }

  public async findOneByField(
    field: string,
    value: any
  ): Promise<T | undefined> {
    const result = await this._model.findOne({ [field]: value } as any).exec();
    return result ?? undefined;
  }

  public async exists(id: String): Promise<boolean>;
  public async exists(field: string, value: any): Promise<boolean>;

  public async exists(idOrField: string, value?: any): Promise<boolean> {
    if (value === undefined) {
      const count = await this._model.countDocuments({ id: idOrField }).exec();

      return count > 0;
    } else {
      const count = await this._model
        .countDocuments({ [idOrField]: value } as any)
        .exec();
      return count > 0;
    }
  }
}
