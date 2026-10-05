import CourtApproval, { ICourtApproval } from "@/schemas/court-approval-schema/court-approval-schema";

export class CourtApprovalRepositoryDb {
  async find(query: any = {}): Promise<ICourtApproval[]> {
    return await CourtApproval.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(query: any): Promise<ICourtApproval | null> {
    return await CourtApproval.findOne(query).exec();
  }

  async create(data: Partial<ICourtApproval>): Promise<ICourtApproval> {
    const record = new CourtApproval(data);
    return await record.save();
  }

  async update(query: any, data: any): Promise<ICourtApproval | null> {
    let updateOperation = data;
    if (!data.$set && !data.$push && !data.$inc) {
      updateOperation = { $set: data };
    }
    return await CourtApproval.findOneAndUpdate(query, updateOperation, { new: true }).exec();
  }

  async count(query: any = {}): Promise<number> {
    return await CourtApproval.countDocuments(query).exec();
  }
}
