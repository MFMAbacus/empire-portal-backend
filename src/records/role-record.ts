import { ObjectId } from "mongoose";

export type UserRoleRecord = {
  _id?: ObjectId;
  id: string;
  roleId:string;
  roleName:string;
};
