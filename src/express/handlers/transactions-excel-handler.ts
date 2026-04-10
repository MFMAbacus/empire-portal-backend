import { Request, Response } from "express";
import ExcelJS from "exceljs";
import { TaskRepositoryDb } from "@/repositories/task-repository/task-repository-db";
import { ITaskRecord } from "@/schemas/tasks-schema";
import { DateTime } from "@/utility/date-time";
import { Task } from "@/schemas/tasks-schema";
import { Transaction } from "@/schemas/transaction-schema";

// eslint-disable-next-line max-len
export const transactionsExcelHandler = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { filters } = request.query;

  if (typeof filters !== "string") {
    response.status(400).send("Bad Request");
    return;
  }

  const filtersParsed: string[][] = JSON.parse(filters);

  const fieldMapping: Record<string, string> = {
    id: "id",
    type: "type",
    status: "status",
    subType: "subType",
    transactionRefCode: "transactionRefCode",
    sapRefCode: "sapRefCode",
    amount: "amount",
    description: "description",
    createdAt: "createdAt",
  };

  const filterObject = filtersParsed[1].reduce(
    (acc: Record<string, any>, value, index) => {
      const filterField = filtersParsed[0][index];
      const schemaField = fieldMapping[filterField];

      if (schemaField) {
        acc[schemaField] = value || undefined;
      }
      return acc;
    },
    {}
  );

  try {
    const query: Record<string, any> = {};

    if (filterObject.id) query.id = { $regex: filterObject.id, $options: "i" };
    if (filterObject.type) query.type = filterObject.type;
    if (filterObject.status) query.status = filterObject.status;
    if (filterObject.subType) query.subType = filterObject.subType;
    if (filterObject.amount) query.amount = filterObject.amount;
    if (filterObject.sapRefCode) query.sapRefCode = filterObject.sapRefCode;
    if (filterObject.transactionRefCode)
      query.transactionRefCode = filterObject.transactionRefCode;
    if (filterObject.createdAt) {
      query.createdAt = { $gte: filterObject.createdAt };
    }

    const transactions = await Transaction.find(query);

    const workbook = new ExcelJS.Workbook();
    const transactionsWorksheet = workbook.addWorksheet("Transactions");

    transactionsWorksheet.columns = [
      { header: "ID", key: "id", width: 20 },
      { header: "Status", key: "status", width: 15 },
      {
        header: "Type",
        key: "type",
        width: 20,
      },
      { header: "Sub Type", key: "subType", width: 20 },
      { header: "Transaction Reference", key: "transactionRefCode", width: 15 },
      { header: "SAP Reference", key: "sapRefCode", width: 15 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Description", key: "description", width: 30 },
      { header: "Created At", key: "createdAt", width: 20 },
    ];
    transactions.forEach((transaction) => {
      transactionsWorksheet.addRow({
        id: transaction.id ?? "-",
        status: transaction.status ?? "-",
        type: transaction.type ?? "-",
        subType: transaction.subType ?? "-",
        transactionRefCode: transaction.transactionRefCode ?? "-",
        sapRefCode: transaction.sapRefCode ?? "-",
        amount: transaction.amount ?? "-",
        description: transaction.description ?? "-",
        createdAt: transaction.createdAt ?? "-",
      });
    });

    response.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    response.setHeader(
      "Content-Disposition",
      `attachment; filename=Transactions ${DateTime.now().toString()}.xlsx`
    );

    await workbook.xlsx.write(response);
    response.end();
  } catch (error) {
    console.error("Error during export:", error);
    response.status(500).send("Error Exporting in excel");
  }
};

interface ISubTaskWithRequestId {
  taskId: string;
  id: string;
  title: string;
  staffName: string;
  completedAt: string;
}
