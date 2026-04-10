import {Collection} from '@/utility/collection';
import {JsonDatabase} from '@/utility/json-database';

export class JsonRepository<Model> {
  protected _jsonDatabase: JsonDatabase<Model>;
  protected _collection: Collection<Model>;

  public constructor(name: string) {
    const jsonFilePath = `storage/database/${name}.json`;
    this._jsonDatabase = JsonDatabase.make<Model>(jsonFilePath);
    this._collection = Collection.make<Model>();
  }

  protected async _load(): Promise<void> {
    const models = await this._jsonDatabase.fetch();
    this._collection.deleteAll().addMany(models);
  }

  protected async _save(): Promise<void> {
    this._jsonDatabase.save(this._collection.getAll());
  }
}
