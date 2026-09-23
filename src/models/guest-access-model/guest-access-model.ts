import { IGuestAccess } from "@/schemas/guest-access-schema";
import GuestAccessSchema from "@/schemas/guest-access-schema";
import { Model } from "mongoose";

export class GuestAccessModel {
  static get schema(): Model<IGuestAccess> {
    return GuestAccessSchema;
  }
}
