import mongoose, { Schema, Document } from "mongoose";

export interface IMenuMaster extends Document {
  id: string;
  menuId: string;
  menuName: string;
  price:number;
  menuItem: string;
  venueId: string;
  isActive: boolean;
  isArchived: boolean;
}

const MenuMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    menuId: { type: String, required: true },
    menuName: { type: String, required: true },
    price: { type: Number, required: false },
    menuItem: { type: String, required: true },
    venueId: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MenuMaster = mongoose.model<IMenuMaster>(
  "MenuMaster",
  MenuMasterSchema
);

export default MenuMaster;
