import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IApprovalRoutingMaster } from "@/schemas/approval-routing-master-schema";

export class ApprovalRoutingMasterModel extends Model {
  public static make(record: Partial<IApprovalRoutingMaster>): ApprovalRoutingMasterModel {
    const filteredRecord: Partial<IApprovalRoutingMaster> = {
      _id: record._id,
      id: record.id,
      routingId: record.routingId,
      module: record.module,
      projectCode: record.projectCode,
      approverRole: record.approverRole,
      approvalLevel: record.approvalLevel,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new ApprovalRoutingMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "module",
      Validation.make(this.get("module")).mandatory().string().getRule()
    );
    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );
    validationBag.set(
      "approverRole",
      Validation.make(this.get("approverRole")).mandatory().string().getRule()
    );
    validationBag.set(
      "approvalLevel",
      Validation.make(this.get("approvalLevel")).mandatory().string().getRule()
    );

    return validationBag;
  }
}