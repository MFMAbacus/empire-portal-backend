import { IWelcomescreenMediaRecord } from "@/schemas/welcomescreen-media-schema";

export interface WelcomescreenMediaRepository {
  getAll(): Promise<IWelcomescreenMediaRecord[]>;
  Create(record: IWelcomescreenMediaRecord): Promise<void>;
  getActive(): Promise<IWelcomescreenMediaRecord[] | undefined>;
  get(id: string): Promise<IWelcomescreenMediaRecord | undefined>;
  update(
    record: Partial<IWelcomescreenMediaRecord>
  ): Promise<IWelcomescreenMediaRecord | undefined>;
  deactivateAll(): Promise<void>;
}
