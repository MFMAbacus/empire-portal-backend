import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import NotificationFCM from "@/utility/notification/notification";

import { AnnouncementModel } from "@/models/announcement-model";
import { AnnouncementRepository } from "@/repositories/announcement-repository";
import { optional } from "@/utility/optional";
import { AnnouncementGroup } from "@/records/announcement-record";
import { IAnnouncement } from "@/schemas/announcements-schema";
import { getTokensByUsersIds } from "@/data/clients-sessions";
import { GetSapCustomersService } from "../get-sap-customers-service";
import { b1Password, b1UrlCustomers, b1User } from "@/config/app";
import axios from "axios";

type Props = {
  announcementRepository: AnnouncementRepository;
};

type Input = {
  title: string;
  description: string;
  publishDate: string;
  expirationDate?: string | null;
  isPublished: boolean;
  group: AnnouncementGroup;
  pts?: string[];
  pss?: string[];
  bps?: string[];
  prs?: string[];
  bls?: string[];
  fls?: string[];
  uns?: string[];
  attachments?: string[];
};

export class CreateAnnouncementService {
  protected _announcementRepository: AnnouncementRepository;

  public constructor(props: Props) {
    this._announcementRepository = props.announcementRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const userModel = AnnouncementModel.make({
      id: Generator.id("A"),
      title: input.title,
      description: input.description,
      publishDate: input.publishDate,
      expirationDate: optional(input.expirationDate, null),
      isPublished: input.isPublished,
      group: input.group,
      pts: optional(input.pts, []),
      pss: optional(input.pss, []),
      bps: optional(input.bps, []),
      prs: optional(input.prs, []),
      bls: optional(input.bls, []),
      fls: optional(input.fls, []),
      uns: optional(input.uns, []),
      attachments: optional(input.attachments, []),
      isArchived: false,
    });

    const validationBag = userModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const announcementRecord: IAnnouncement = userModel.getRecord();

    const customersIds = [
      ...new Set(input.bps?.map((item) => item.split("$-$")[1])),
    ];

    await this._announcementRepository.Create(announcementRecord);

    if (input.group === "staff") {
      await NotificationFCM.getInstance().sendToMany(
        {
          title: `New Announcement: ${input.title}`,
          messageId: Generator.id(),
          body: input.description,
          id: announcementRecord.id,
          type: "announcement",
          topic: "Staff",
        },
        []
      );
    } else if (input.group === "customers") {
      const tokens = await getTokensByUsersIds(customersIds ?? []);
      if (tokens.length > 0) {
        await NotificationFCM.getInstance().sendToMany(
          {
            title: `New Announcement: ${input.title}`,
            messageId: Generator.id(),
            body: input.description,
            id: announcementRecord.id,
            type: "announcement",
          },
          tokens
        );
      }
    } else if (input.group === "customers-staff") {
      await NotificationFCM.getInstance().sendToMany(
        {
          title: `New Announcement: ${input.title}`,
          messageId: Generator.id(),
          body: input.description,
          id: announcementRecord.id,
          topic: "Staff",
          type: "announcement",
        },
        []
      );

      const tokens = await getTokensByUsersIds(customersIds ?? []);

      if (tokens.length > 0) {
        await NotificationFCM.getInstance().sendToMany(
          {
            title: `New Announcement: ${input.title}`,
            messageId: Generator.id(),
            body: input.description,
            id: announcementRecord.id,
            type: "announcement",
          },
          tokens
        );
      }
    }

    return Result.ok(userModel.get("id"));
  }
}
