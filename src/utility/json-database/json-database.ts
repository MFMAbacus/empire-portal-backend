import fs from 'fs';
import path from 'path';

export class JsonDatabase<Record> {
  protected readonly _jsonFilePath: string;

  protected constructor(jsonFilePath: string) {
    this._jsonFilePath = jsonFilePath;
  }

  public static make<Record>(jsonFilePath: string): JsonDatabase<Record> {
    const jsonDatabase = new JsonDatabase<Record>(jsonFilePath);
    return jsonDatabase;
  }

  public async fetch(): Promise<Record[]> {
    const filePath = path.resolve(this._jsonFilePath);
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) {
      const initialRecords: Record[] = [];
      const initialStringRecords = JSON.stringify(initialRecords, null, 2);
      fs.writeFileSync(filePath, initialStringRecords, 'utf-8');
      return initialRecords;
    }
    const stringRecords = fs.readFileSync(filePath, 'utf-8');
    const records: Record[] = JSON.parse(stringRecords);
    return records;
  }

  public async save(records: Record[]): Promise<void> {
    const stringRecords = JSON.stringify(records, null, 2);
    fs.writeFileSync(path.resolve(this._jsonFilePath), stringRecords, {
      encoding: 'utf-8',
    });
  }
}
