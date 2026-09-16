import mongoose, { Schema, Document } from "mongoose";

export interface IProjectCourtMaster extends Document {
  id: string;
  courtId: string;
  projectCode: string;
  isAccess: boolean;
  isActive: boolean;
  isArchived: boolean;
}

const ProjectCourtMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    courtId: { type: String, required: true },
    projectCode: { type: String, required: true },
    isAccess: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ProjectCourtMaster = mongoose.model<IProjectCourtMaster>(
  "ProjectCourtMaster",
  ProjectCourtMasterSchema
);

export default ProjectCourtMaster;