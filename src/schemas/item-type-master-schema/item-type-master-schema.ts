import mongoose, { Schema, Document } from "mongoose";

export interface IItemTypeMaster extends Document {
  id: string;
  itemTypeId: string;
  itemTypeName: string;
  description: string;
  isActive: boolean;
  isArchived: boolean;
}

const ItemTypeMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    itemTypeId: { type: String, required: true },
    itemTypeName: { type: String, required: true },
    description: { type: String, required: true},
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ItemTypeMaster = mongoose.model<IItemTypeMaster>(
  "ItemTypeMaster",
  ItemTypeMasterSchema
);

export default ItemTypeMaster;