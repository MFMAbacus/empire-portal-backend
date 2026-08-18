import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";

import { MeetingRecord } from "@/records/meeting-record";
import { Validation } from "@/utility/validation";
import { IMeetingRecord } from "@/schemas/meetings-schema";

export class MeetingModel extends Model {
  public static make(record: Partial<IMeetingRecord>): MeetingModel {
    const filteredRecord: Partial<IMeetingRecord> = {
      _id: record._id,
      id: record.id,
      subject: record.subject,
      date: record.date,
      time: record.time,
      duration: record.duration,
      location: record.location,
      importance: record.importance,
      agenda: record.agenda,
      invitation: record.invitation,
    };

    const model = new MeetingModel(Model._makeAttributes(filteredRecord));

    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "subject",
      Validation.make(this.get("subject")).mandatory().string().getRule()
    );
    validationBag.set(
      "date",
      Validation.make(this.get("date")).mandatory().date().getRule()
    );
    validationBag.set(
      "time",
      Validation.make(this.get("time")).mandatory().time().getRule()
    );
    validationBag.set(
      "duration",
      Validation.make(this.get("duration")).mandatory().number().getRule()
    );
    validationBag.set(
      "location",
      Validation.make(this.get("location")).mandatory().string().getRule()
    );
    validationBag.set(
      "importance",
      Validation.make(this.get("importance"))
        .mandatory()
        .string({
          pattern: /^(low|medium|high|urgent)$/,
        })
        .getRule()
    );
    validationBag.set(
      "agenda",
      Validation.make(this.get("agenda")).mandatory().string().getRule()
    );

    return validationBag;
  }
}
