import mongoose, { Schema, Document } from "mongoose";

export interface IMovementTypeMaster extends Document {
  id: string;
  movementTypeId: string;
  type: string;
  isActive: boolean;
  isArchived: boolean;
}

const MovementTypeMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    movementTypeId: { type: String, required: true },
    type: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MovementTypeMaster = mongoose.model<IMovementTypeMaster>(
  "MovementTypeMaster",
  MovementTypeMasterSchema
);

export default MovementTypeMaster;