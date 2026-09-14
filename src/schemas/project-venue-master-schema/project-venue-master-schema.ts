import mongoose, { Schema, Document } from "mongoose";

export interface IProjectVenueMaster extends Document {
  id: string;
  venueId: string;
  projectCode: string;
  isAccess: boolean;
  isActive: boolean;
  isArchived: boolean;
}

const ProjectVenueMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    venueId: { type: String, required: true },
    projectCode: { type: String, required: true },
    isAccess: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ProjectVenueMaster = mongoose.model<IProjectVenueMaster>(
  "ProjectVenueMaster",
  ProjectVenueMasterSchema
);

export default ProjectVenueMaster;