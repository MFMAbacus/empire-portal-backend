import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { DateTime } from "@/utility/date-time";

import { IAnnouncement } from "@/schemas/announcements-schema";
import { SessionRecord } from "@/records/session-record";
import { AnnouncementRepository } from "@/repositories/announcement-repository";

type Props = {
  announcementRepository: AnnouncementRepository;
};

type Input = {
  isArchived?: boolean;
  sessionRecord: SessionRecord;
  unitId?: string;
  cardCode?: string;
};

export class GetAnnouncementsService {
  protected _announcementRepository: AnnouncementRepository;

  public constructor(props: Props) {
    this._announcementRepository = props.announcementRepository;
  }

  // eslint-disable-next-line max-len
  public async execute(
    input: Input,
  ): Promise<Result<IAnnouncement[], Failure>> {
    let announcementsRecords = await this._announcementRepository.getAll();

    if (input.sessionRecord.role === "manager")
      return Result.ok(announcementsRecords);

    announcementsRecords = announcementsRecords.filter((current) => {
      return current.isArchived === Boolean(input.isArchived);
    });

    if (typeof input.cardCode !== "undefined") {
      const cardCode = input.cardCode;
      announcementsRecords = announcementsRecords.filter((current) => {
        return current.bps.includes(cardCode);
      });
    }

    announcementsRecords = announcementsRecords.filter((current) => {
      return current.group.includes(input.sessionRecord.role);
    });

    announcementsRecords = announcementsRecords.filter((current) => {
      return (
        current.uns.length === 0 ||
        (current.uns.some((id: string) => id === input.unitId) &&
          current.group !== "staff")
      );
    });

    if (
      typeof input.sessionRecord.userId !== "undefined" &&
      input.sessionRecord.role === "customer"
    ) {
      const userId = input.sessionRecord.userId;

      announcementsRecords = announcementsRecords.filter((current) => {
        if (!Array.isArray(current.bps)) return false;

        return current.bps.some((item) => {
          if (typeof item !== "string") return false;

          const parts = item.split("$-$");
          if (parts.length < 2 || !parts[1]) return false;

          const bpsCustomerId = parts[1];

          return bpsCustomerId === userId;
        });
      });
    }

    const date = new Date();

    announcementsRecords = announcementsRecords.filter((current) => {
      const publishDate = new Date(current.publishDate);
      const expireDate = current.expirationDate
        ? new Date(current.expirationDate)
        : null;

      if (!(date >= publishDate && (!expireDate || date <= expireDate))) {
        console.log("Record out of range:", current);
      }
      return date >= publishDate && (!expireDate || date <= expireDate);
    });

    return Result.ok(announcementsRecords);
  }
}
