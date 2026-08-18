import { Request, Response } from "express";
import ExcelJS from "exceljs";
import {
  Request as RequestSchema,
  RequestItem as RequestItemSchema,
  IRequestRecord,
} from "@/schemas/request-schema";
import { RequestRepositoryDb } from "@/repositories/request-repository";

import { RequestItemRecord } from "@/records/request-record";
import { DateTime } from "@/utility/date-time";

// eslint-disable-next-line max-len
export const requestsExcelHandler = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { filters } = request.query;

  if (typeof filters !== "string") {
    response.status(400).send("Bad Request");
    return;
  }

  const filtersParsed: string[][] = JSON.parse(filters);

  if (!Array.isArray(filtersParsed)) {
    response.status(400).send("Bad Request");
    return;
  }

  const fieldMapping: Record<string, string> = {
    id: "id",
    category: "categoryName",
    customer: "customerName",
    unit: "unitName",
    assignedTo: "staffName",
    minDate: "creationDate",
    maxDate: "creationDate",
    type: "type",
    status: "status",
    approval: "isApproved",
    sortBy: "creationDate",
    sortOrder: "sortOrder",
    showArchived: "isArchived",
  };

  const filterObject = filtersParsed[1].reduce(
    (acc: Record<string, any>, value, index) => {
      const filterField = filtersParsed[0][index];
      const schemaField = fieldMapping[filterField];

      if (schemaField) {
        if (filterField === "showArchived") {
          acc[schemaField] =
            value === "true" ? true : value === "false" ? false : undefined;
        } else if (filterField === "approval") {
          acc[schemaField] =
            value === "approved"
              ? true
              : value === "refused"
              ? false
              : undefined;
        } else if (filterField === "minDate") {
          acc["minDate"] = value ? DateTime.parse(value).toString() : undefined;
        } else if (filterField === "maxDate") {
          acc["maxDate"] = value ? DateTime.parse(value).toString() : undefined;
        } else {
          acc[schemaField] = value || undefined;
        }
      }
      return acc;
    },
    {}
  );

  try {
    const query: Record<string, any> = {};

    if (filterObject.id) query.id = { $regex: filterObject.id, $options: "i" };

    if (filterObject.isApproved !== undefined)
      query.isApproved = filterObject.isApproved;

    if (filterObject.isArchived !== undefined)
      query.isArchived = filterObject.isArchived;

    if (filterObject.minDate || filterObject.maxDate) {
      query.creationDate = {};
      if (filterObject.minDate) query.creationDate.$gte = filterObject.minDate;
      if (filterObject.maxDate) query.creationDate.$lte = filterObject.maxDate;
    }

    if (filterObject.staffName)
      query.staffName = { $regex: filterObject.staffName, $options: "i" };

    if (filterObject.status) query.status = filterObject.status;

    if (filterObject.type)
      query.type = { $regex: filterObject.type, $options: "i" };

    if (filterObject.categoryName)
      query.categoryName = {
        $regex: filterObject.categoryName,
        $options: "i",
      };

    if (filterObject.customerName)
      query.customerName = {
        $regex: filterObject.customerName,
        $options: "i",
      };

    if (filterObject.unitName)
      query.unitName = { $regex: filterObject.unitName, $options: "i" };

    const sort: Record<string, 1 | -1> = {};
    if (filterObject.sortOrder) {
      sort.creationDate = filterObject.sortOrder === "asc" ? 1 : -1;
    } else {
      sort._id = -1;
    }

    const Requests = await RequestSchema.find(query)
      .populate(["items", "payments"])
      .sort(sort);

    let RequestItems: IItemRecordWithRequestId[] = [];

    Requests.forEach((request) =>
      request.items.forEach((item) =>
        RequestItems.push({
          itemId: item.itemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice,
          requestId: request.id,
        })
      )
    );

    Requests.forEach((req) => {
      if (!req.payments[0]?.method) {
        return req;
      }
    });

    const workbook = new ExcelJS.Workbook();
    const requestsWorksheet = workbook.addWorksheet("Requests");
    const requestsItemsWorksheet = workbook.addWorksheet("Requests Items");

    requestsWorksheet.columns = [
      { header: "ID", key: "id", width: 20 },
      { header: "Status", key: "status", width: 15 },
      {
        header: "SAP Customer Code",
        key: "sapCustomerCode",
        width: 20,
      },
      { header: "Customer Name", key: "customerName", width: 20 },
      { header: "Assigned Staff", key: "assignedStaff", width: 20 },
      { header: "Type", key: "type", width: 15 },
      { header: "Title", key: "title", width: 30 },
      { header: "Category Name", key: "categoryName", width: 20 },
      { header: "SubCategory Name", key: "subCategoryName", width: 20 },
      { header: "Creation Date", key: "creationDate", width: 20 },
      { header: "Close Date", key: "closeDate", width: 20 },
      { header: "Total Amount", key: "totalAmount", width: 15 },
      { header: "Payment Method", key: "paymentMethod", width: 15 },
      { header: "Payment Date", key: "paymentDate", width: 20 },
    ];

    Requests.forEach((request) => {
      requestsWorksheet.addRow({
        id: request.id ?? "-",
        status: request.status ?? "-",
        sapCustomerCode: request.customerCode ?? "-",
        customerName: request.customerName ?? "-",
        assignedStaff: request.staffName ?? "-",
        type: request.type ?? "-",
        title: request.title ?? "-",
        categoryName: request.categoryName ?? "-",
        subCategoryName:
          request.subCategoryName && request.subCategoryName.length > 1
            ? request.subCategoryName
            : "-",
        creationDate: request.creationDate ?? "-",
        closeDate: request.completedAt ?? "-",
        totalAmount: request.totalPrice ?? "-",
        paymentMethod:
          request.payments[0]?.method && request.payments[0]?.method.length > 1
            ? request.payments[0]?.method
            : "-",
        paymentDate:
          request.payments[0]?.date && request.payments[0]?.date.length > 1
            ? request.payments[0]?.date
            : "-",
      });
    });

    requestsItemsWorksheet.columns = [
      { header: "Request ID", key: "requestId", width: 20 },
      { header: "Item ID", key: "itemId", width: 20 },
      { header: "Name", key: "name", width: 25 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Price", key: "price", width: 10 },
      { header: "Total Price", key: "totalPrice", width: 15 },
    ];
    RequestItems.forEach((item) => {
      requestsItemsWorksheet.addRow({
        itemId: item.itemId ?? "-",
        name: item.name ?? "-",
        quantity: item.quantity ?? "-",
        price: item.price ?? "-",
        totalPrice: item.totalPrice ?? "-",
        requestId: item.requestId ?? "-",
      });
    });

    response.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    response.setHeader(
      "Content-Disposition",
      `attachment; filename=Requests ${DateTime.now().toString()}.xlsx`
    );

    await workbook.xlsx.write(response);
    response.end();
  } catch (error) {
    console.error("Error during export:", error);
    response.status(500).send("Error Exporting in excel");
  }
};

interface IItemRecordWithRequestId {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
  requestId: string;
}
