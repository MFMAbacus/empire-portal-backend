import { ObjectId } from "mongoose";

export type EmailTemplateMasterRecord = {
  _id?: ObjectId;
  id: string;
  TemplateCode: string;
  module: string;
  event: string;
  subject:string;
  body: string;
  isActive: boolean;
  isArchived: boolean;
};
