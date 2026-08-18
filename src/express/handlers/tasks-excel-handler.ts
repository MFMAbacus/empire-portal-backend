import { Request, Response } from "express";
import ExcelJS from "exceljs";
import { TaskRepositoryDb } from "@/repositories/task-repository/task-repository-db";
import { ITaskRecord } from "@/schemas/tasks-schema";
import { DateTime } from "@/utility/date-time";
import { Task } from "@/schemas/tasks-schema";

// eslint-disable-next-line max-len
export const tasksExcelHandler = async (
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
    title: "title",
    category: "categoryName",
    customer: "customerName",
    priority: "priority",
    assignedTo: "staffName",
    minDate: "creationDate",
    maxDate: "creationDate",
    closeDate: "closedAt",
    status: "status",
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
        } else if (filterField === "sortBy") {
          if (value === "created-at") {
            acc["sortByDate"] = value;
          } else if (value === "priority") {
            acc["sortByPriority"] = value;
          }
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
    if (filterObject.title)
      query.title = { $regex: filterObject.title, $options: "i" };
    if (filterObject.categoryName)
      query.categoryName = { $regex: filterObject.categoryName, $options: "i" };
    if (filterObject.customerName)
      query.customerName = { $regex: filterObject.customerName, $options: "i" };
    if (filterObject.priority) query.priority = filterObject.priority;
    if (filterObject.staffName)
      query.staffName = { $regex: filterObject.staffName, $options: "i" };
    if (filterObject.minDate || filterObject.maxDate) {
      query.creationDate = {};
      if (filterObject.minDate) query.creationDate.$gte = filterObject.minDate;
      if (filterObject.maxDate) query.creationDate.$lte = filterObject.maxDate;
    }
    if (filterObject.closedAt) query.closedAt = filterObject.closedAt;
    if (filterObject.status) query.status = filterObject.status;
    if (filterObject.creationDate)
      query.creationDate = filterObject.creationDate;
    if (filterObject.isArchived !== undefined)
      query.isArchived = filterObject.isArchived;

    const sort: Record<string, 1 | -1> = {};
    if (filterObject.sortByDate) {
      sort.creationDate = filterObject.sortOrder === "asc" ? 1 : -1;
    }

    const tasks = await Task.find(query).populate("subTasks").sort(sort);
    let Subtask: ISubTaskWithRequestId[] = [];

    tasks.forEach((task) =>
      task.subTasks.forEach((subtask) =>
        Subtask.push({
          taskId: task.id,
          id: subtask.id ?? "-",
          title: subtask.title ?? "-",
          staffName: subtask.staffName ?? "-",
          completedAt: subtask.completedAt ?? "-",
        })
      )
    );

    const workbook = new ExcelJS.Workbook();
    const tasksWorksheet = workbook.addWorksheet("Tasks");
    const subTasksWorksheet = workbook.addWorksheet("Sub Tasks");

    tasksWorksheet.columns = [
      { header: "ID", key: "id", width: 20 },
      { header: "Status", key: "status", width: 15 },
      {
        header: "Customer",
        key: "customerName",
        width: 20,
      },
      { header: "Assigned Staff", key: "staffName", width: 20 },
      { header: "Title", key: "title", width: 15 },
      { header: "Category", key: "categoryName", width: 30 },
      { header: "Priority", key: "priority", width: 20 },
      { header: "Creation Date", key: "creationDate", width: 20 },
      { header: "Close Date", key: "closedAt", width: 20 },
    ];
    tasks.forEach((task) => {
      tasksWorksheet.addRow({
        id: task.id ?? "-",
        status: task.status ?? "-",
        customerName: task.customerName ?? "-",
        staffName: task.staffName ?? "-",
        title: task.title ?? "-",
        categoryName: task.categoryName ?? "-",
        creationDate: task.creationDate ?? "-",
        priority: task.priority ?? "-",
        closedAt: task.closedAt ?? "-",
      });
    });

    subTasksWorksheet.columns = [
      { header: "Task ID", key: "taskId", width: 20 },
      { header: "Sub-Task ID", key: "id", width: 20 },
      { header: "Title", key: "title", width: 25 },
      { header: "Assigned Staff", key: "staffName", width: 20 },
      { header: "Close Date", key: "completedAt", width: 20 },
    ];

    Subtask.forEach((item) => {
      subTasksWorksheet.addRow({
        taskId: item.taskId ?? "-",
        id: item.id ?? "-",
        title: item.title ?? "-",
        staffName: item.staffName ?? "-",
        completedAt: item.completedAt ?? "-",
      });
    });

    response.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    response.setHeader(
      "Content-Disposition",
      `attachment; filename=Tasks ${DateTime.now().toString()}.xlsx`
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
