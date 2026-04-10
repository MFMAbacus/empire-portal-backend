import {
  IMeetingInvitationRecord,
  IMeetingRecord,
} from "@/schemas/meetings-schema";

export abstract class MeetingRepository {
  public abstract getAll(): Promise<IMeetingRecord[]>;
  public abstract get(id: string): Promise<IMeetingRecord | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: IMeetingRecord): Promise<void>;
  public abstract Update(
    record: IMeetingRecord,
    updateData?: IMeetingInvitationRecord,
    model?: any,
    name?: "invitation"
  ): Promise<void>;
  public abstract updateInvitation(
    record: IMeetingInvitationRecord
  ): Promise<void>;
  public abstract Delete(record: IMeetingRecord): Promise<void>;
}
