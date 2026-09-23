import { IGuestAccess } from "@/schemas/guest-access-schema";

export type GetAllGuestAccessOptions = {
  isArchived?: boolean;
  residentId?: string;
};

export interface GuestAccessRepository {
  getAll(options?: GetAllGuestAccessOptions): Promise<IGuestAccess[]>;
  get(id: string): Promise<IGuestAccess | undefined>;
  exists(id: string): Promise<boolean>;
  Create(record: IGuestAccess): Promise<void>;
  Update(record: Partial<IGuestAccess>): Promise<IGuestAccess | undefined>;
  delete(id: string): Promise<IGuestAccess | null>;
}
