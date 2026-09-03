import mongoose, { Schema, Document } from "mongoose";

export interface IPropertyMaster extends Document {
  id: string;
  projectCode: string;
  projectName: string;
  propertyName: string;
  isActive: boolean;
  isArchived: boolean;
}

const PropertyMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    projectCode: { type: String, required: true },
    projectName: { type: String, required: true },
    propertyName: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PropertyMaster = mongoose.model<IPropertyMaster>(
  "ProjectMaster",
  PropertyMasterSchema
);

export default PropertyMaster;
