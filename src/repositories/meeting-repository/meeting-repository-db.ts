import { Model } from "mongoose";
import {
  Meeting,
  IMeetingRecord,
  MeetingInvitation,
  IMeetingInvitationRecord,
} from "@/schemas/meetings-schema";
import { MeetingRepository } from "./meeting-repository";
import { MongoRepository } from "@/utility/mongo-repository";

export class MeetingRepositoryDb extends MongoRepository<IMeetingRecord> {
  public constructor() {
    super(Meeting);
  }

  public async getAll(): Promise<IMeetingRecord[]> {
    return await super.getAll({}, ["invitation"]);
  }

  public async get(id: string): Promise<IMeetingRecord | undefined> {
    return super.get(id, ["invitation"]);
  }

  public async exists(id: string): Promise<boolean> {
    const count = await this.exists(id);
    return count;
  }

  public async Create(record: IMeetingRecord): Promise<void> {
    if (record.invitation.length > 0) {
      const invitationPromises = record.invitation.map(
        async (item: IMeetingInvitationRecord) => {
          const createdInvitation = await MeetingInvitation.create(item);
          return createdInvitation._id;
        }
      );
      const invitationIds = await Promise.all(invitationPromises);
      record.invitation = invitationIds as any;
    }

    await super.create(record);
  }

  public async Update(record: IMeetingRecord): Promise<void> {
    try {
      let invitationIds: any = [];

      const { invitation, ...recordWithoutInvitation } = record;

      // if (invitation && invitation.length > 0) {
      //   const invitationPromises = invitation.map(
      //     async (item: IMeetingInvitationRecord) => {
      //       const createdInvitation = await MeetingInvitation.create(item);
      //       return createdInvitation._id;
      //     }
      //   );
      //   invitationIds = await Promise.all(invitationPromises);
      // }

      await Meeting.updateOne(
        { id: record.id },
        {
          $push: { invitation: { $each: invitationIds } },
          ...recordWithoutInvitation,
        }
      );
    } catch (error) {
      console.error("Error updating the record:", error);
      throw error;
    }
  }

  public async updateInvitation(
    record: IMeetingInvitationRecord
  ): Promise<void> {
    await MeetingInvitation.findByIdAndUpdate(
      { _id: record._id },
      { ...record },
      { new: true }
    );
  }

  public async Delete(record: IMeetingRecord): Promise<void> {
    await super.update(record);
  }
}
