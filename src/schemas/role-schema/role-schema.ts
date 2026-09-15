import mongoose, { Schema, Document } from "mongoose";

export interface IUserRole extends Document {
  id: string;
  roleId:string;
  roleName: string;
}

const UserRoleSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    roleId: { type: String, required: true, unique: true },
    roleName: { type: String, required: true },
  },
  { timestamps: true }
);

const UserRole = mongoose.model<IUserRole>(
  "UserRole",
  UserRoleSchema
);

export default UserRole;