import { IMoveApproval } from "@/schemas/move-approval-schema";

export type GetAllMoveApprovalOptions = {
  isArchived?: boolean;
  residentId?: string;
  projectCode?: string;
};

export interface MoveApprovalRepository {
  getAll(options?: GetAllMoveApprovalOptions): Promise<IMoveApproval[]>;
  get(id: string): Promise<IMoveApproval | undefined>;
  exists(id: string): Promise<boolean>;
  Create(record: IMoveApproval): Promise<void>;
  Update(record: Partial<IMoveApproval>): Promise<IMoveApproval | undefined>;
  delete(id: string): Promise<IMoveApproval | null>;
}
