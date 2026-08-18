export class Collection<Record> {
  protected _records: Record[];

  protected constructor() {
    this._records = [];
  }

  public static make<Record>(): Collection<Record> {
    const collection = new Collection<Record>();
    return collection;
  }

  public getAll(): Record[] {
    return this._records;
  }

  public find(predicate: (record: Record) => boolean): Record | undefined {
    return this._records.find(predicate);
  }

  public findMany(predicate: (record: Record) => boolean): Record[] {
    return this._records.filter(predicate);
  }

  public add(record: Record): Collection<Record> {
    this._records.push(record);
    return this;
  }

  public addMany(records: Record[]): Collection<Record> {
    for (const record of records) {
      this.add(record);
    }
    return this;
  }

  public updateMany(callback: (record: Record) => Record): Collection<Record> {
    this._records = this._records.map(callback);
    return this;
  }

  // eslint-disable-next-line max-len
  public deleteMany(predicate: (record: Record) => boolean): Collection<Record> {
    this._records = this._records.filter((record) => !predicate(record));
    return this;
  }

  public deleteAll(): Collection<Record> {
    this._records = [];
    return this;
  }

  public getCount(): number {
    return this._records.length;
  }
}
