import mongoose, { Schema, Document, Types } from "mongoose";
import { IRequestItemRecord } from "./request-item-record";
import { IRequestUpdate } from "./request-update-schema";
import { IRequestPaymentRecord } from "./request-payment-schema";

export type RequestPriority = "low" | "medium" | "hight";

export type RequestVisitTime = "none" | "morning" | "afternoon";

export type RequestType = "general" | "buy" | "maintenance";

export interface IRequestRateRecord {
  value: number;
  comment: string;
}

export interface IRequestRecord extends Document {
  id: string;
  type: RequestType;
  categoryId: string;
  categoryName: string;
  project: string | null;
  subCategoryName: string | null;
  title: string;
  description: string;
  customerId: string;
  customerName: string;
  customerCode: string;
  staffId: string | null;
  staffName: string | null;
  salesPersonId: string | null;
  unitId: string;
  unitName: string;
  status: string;
  paymentStatus: string;
  priority: RequestPriority;
  visitDate: string;
  visitTime: RequestVisitTime;
  totalPrice: number;
  totalPayments: number;
  isApproved: boolean;
  approvedAt: string | null;
  approveRemarks: string | null;
  isRefused: boolean;
  refusedAt: string | null;
  refuseRemarks: string | null;
  completedAt: string | null;
  completeRemarks: string | null;
  completeAttachments: string[];
  items: IRequestItemRecord[];
  attachments: string[];
  updates: IRequestUpdate[];
  payments: IRequestPaymentRecord[];
  rate: IRequestRateRecord | null;
  isIntangible: boolean;
  pin: string | null;
  buyAttachments: string[];
  creationDate: string;
  isArchived: boolean;
  postedToSap: boolean | null;
  isShow: false;
}

const RequestSchema = new Schema<IRequestRecord>({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ["general", "buy", "maintenance"],
    required: true,
  },
  categoryId: { type: String, required: true },
  categoryName: { type: String, required: true },
  project: { type: String, default: null },
  subCategoryName: { type: String, default: null },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerCode: { type: String, required: true },
  staffId: { type: String, default: null },
  staffName: { type: String, default: null },
  salesPersonId: { type: String, default: null },
  unitId: { type: String, required: true },
  unitName: { type: String, required: true },
  status: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["Unpaid", "Pending", "Paid", "None"],
    default: null,
  },
  priority: { type: String, enum: ["low", "medium", "hight"], required: true },
  visitDate: { type: String, required: true },
  visitTime: {
    type: String,
    enum: ["none", "morning", "afternoon"],
    required: true,
  },
  totalPrice: { type: Number, required: true },
  totalPayments: { type: Number, required: true },
  isApproved: { type: Boolean, required: true },
  approvedAt: { type: String, default: null },
  approveRemarks: { type: String, default: null },
  isRefused: { type: Boolean, required: true },
  refusedAt: { type: String, default: null },
  refuseRemarks: { type: String, default: null },
  completedAt: { type: String, default: null },
  completeRemarks: { type: String, default: null },
  completeAttachments: { type: [String], required: true },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RequestItem",
      required: true,
    },
  ],
  attachments: { type: [String], required: true },
  updates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RequestUpdate",
      required: true,
    },
  ],
  payments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RequestPayment",
      required: true,
    },
  ],
  rate: {
    type: {
      value: { type: Number, required: true },
      comment: { type: String, required: true },
    },
    default: null,
  },
  isIntangible: { type: Boolean, required: true },
  pin: { type: String, default: null },
  buyAttachments: { type: [String], required: true },
  creationDate: { type: String, required: true },
  isArchived: { type: Boolean, required: true },

  postedToSap: { type: Boolean, default: null },
});

RequestSchema.virtual("isShow").get(function () {
  return !(
    (this.paymentStatus === "Unpaid" || this.paymentStatus === "Pending") &&
    this.status === "in-progress" &&
    this.type === "buy"
  );
});

// Pre-save middleware to calculate totalPrice
RequestSchema.pre("save", function (next) {
  const request = this as IRequestRecord;

  // Sum the totalPrice of all items
  request.totalPrice = request.items.reduce(
    (acc, item) => acc + item.totalPrice,
    0
  );

  next();
});

export const Request = mongoose.model<IRequestRecord>("Request", RequestSchema);
