import { Request, Response } from "express";
import ExcelJS from "exceljs";
import { TaskRepositoryDb } from "@/repositories/task-repository/task-repository-db";
import { ITaskRecord } from "@/schemas/tasks-schema";
import { DateTime } from "@/utility/date-time";
import { Task } from "@/schemas/tasks-schema";
import { Transaction } from "@/schemas/transaction-schema";
import { Customer } from "@/schemas/customer-schema/cutomer-schema";

export const customerExcelHandler = async (
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
    projectId: "projectId",
    firstName: "firstName",
    lastName: "lastName",
    email: "email",
    phoneNumber: "phoneNumber",
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

    if (filterObject.id) query.id = filterObject.id;
    if (filterObject.projectId) query.projectId = filterObject.projectId;
    if (filterObject.firstName) query.firstName = filterObject.firstName;
    if (filterObject.lastName) query.lastName = filterObject.lastName;
    if (filterObject.email) query.email = filterObject.email;
    if (filterObject.phoneNumber) {
      query.phoneNumber = filterObject.phoneNumber;
    }

    const customers = await Customer.find(query);

    const workbook = new ExcelJS.Workbook();
    const transactionsWorksheet = workbook.addWorksheet("Transactions");

    transactionsWorksheet.columns = [
      { header: "ID", key: "id", width: 20 },
      {
        header: "First Name",
        key: "firstName",
        width: 20,
      },
      {
        header: "Last Name",
        key: "lastName",
        width: 20,
      },
      {
        header: "User Name",
        key: "username",
        width: 20,
      },
      {
        header: "Email",
        key: "email",
        width: 20,
      },
      {
        header: "Phone Number",
        key: "phoneNumber",
        width: 20,
      },
      {
        header: "Project ID",
        key: "projectId",
        width: 20,
      },
      {
        header: "DOB",
        key: "dateOfBirth",
        width: 20,
      },
    ];
    customers.forEach((customer) => {
      transactionsWorksheet.addRow({
        id: customer.id ?? "-",
        firstName: customer.firstName,
        lastName: customer.lastName ?? "-",
        username: customer.username ?? "-",
        email: customer.email ?? "-",
        phoneNumber: customer.phoneNumber ?? "-",
        projectId: customer.projectId ?? "-",
        dateOfBirth: customer.dateOfBirth ?? "-",
      });
    });

    response.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    response.setHeader(
      "Content-Disposition",
      `attachment; filename=Customers ${DateTime.now().toString()}.xlsx`
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
