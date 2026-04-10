import http from "http";
import express from "express";

import { host, port } from "@/config/app";

import { corsHandler } from "@/express/handlers/cors-handler";
import { badRequestHandler } from "@/express/handlers/bad-request-handler";
import { notFoundHandler } from "@/express/handlers/not-found-handler";
import { errorHandler } from "@/express/handlers/error-handler";
import { uploadHandler } from "@/express/handlers/upload-handler";

import { usersRouter } from "@/express/routers/users-router";
import { customersRouter } from "@/express/routers/customers-router";
import { staffRouter } from "@/express/routers/staff-router";
import { authRouter } from "@/express/routers/auth-router";
import { announcementsRouter } from "@/express/routers/announcements-router";
// eslint-disable-next-line max-len
import { categoriesRouter } from "@/express/routers/categories-router";
import { itemsRouter } from "@/express/routers/items-router";
import { requestsRouter } from "@/express/routers/requests-router";
import { tasksRouter } from "@/express/routers/tasks-router";
import { paymentsRouter } from "@/express/routers/payments-router";
import { departmentsRouter } from "@/express/routers/departments-router";
import { projectsRouter } from "@/express/routers/projects-router";
import { buildingsRouter } from "@/express/routers/buildings-router";
import { floorsRouter } from "@/express/routers/floors-router";
import { unitsRouter } from "@/express/routers/units-router";
import { notificationsRouter } from "@/express/routers/notifications-router";
import { meetingsRouter } from "@/express/routers/meetings-router";
import { reportsRouter } from "@/express/routers/reports-router";
import { salespersonsRouter } from "@/express/routers/salespersons-router";
import { issuesRouter } from "@/express/routers/issues-router";
import { balancesRouter } from "@/express/routers/balances-router";
import { excelHandler } from "@/express/handlers/excel-handler";
import { requestsExcelHandler } from "@/express/handlers/requests-excel-handler";
import { tasksExcelHandler } from "@/express/handlers/tasks-excel-handler";
// eslint-disable-next-line max-len
import { invoicesPaymentsRouter } from "@/express/routers/invoices-payments-router";
import { propertyTypesRouter } from "@/express/routers/property-types-router";
import { fastPayRouter } from "@/express/routers/fastpay-router";
import { hyperPayRouter } from "@/express/routers/hyperpay-router";

import { connection } from "@/db/conn";
import cors from "cors";
import { CronSchedular } from "@/services/cron-schedular";
import { welcomescreenMediaRouter } from "./routers/welcomescreen-media-router";
import { transactionsRouter } from "./routers/transactions-router";
import { generalConfigurationsRouter } from "./routers/general-configurations-router";
import { MigrationRunner } from "@/migrations";
import { transactionsExcelHandler } from "./handlers/transactions-excel-handler";
import { customerExcelHandler } from "./handlers/customer-excel-handler";

connection();

MigrationRunner.runAll()
  .then(() => console.log("Migration process completed"))
  .catch((error) => {
    console.error("Migration process failed:", error);
    process.exit(1);
  });

const app = express();

const httpServer = http.createServer(app);

app.disable("etag");
app.disable("x-powered-by");

app.use(express.json({ limit: "300mb" }));
app.use(express.urlencoded({ limit: "300mb", extended: true }));

CronSchedular();

app.use(badRequestHandler);
app.use(
  cors({
    origin: "*",

    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
// app.use("*", corsHandler);
app.use("/uploads", express.static("storage/uploads"));
app.post("/upload", uploadHandler);
app.get("/excel", excelHandler);
app.get("/requests-excel", requestsExcelHandler);
app.get("/tasks-excel", tasksExcelHandler);
app.get("/transactions-excel", transactionsExcelHandler);
app.get("/customer-excel", customerExcelHandler);
app.use("/users", usersRouter);
app.use("/customers", customersRouter);
app.use("/staff", staffRouter);
app.use("/auth", authRouter);
app.use("/requests", requestsRouter);
app.use("/tasks", tasksRouter);
app.use("/announcements", announcementsRouter);
app.use("/categories", categoriesRouter);
app.use("/items", itemsRouter);
app.use("/payments", paymentsRouter);
app.use("/invoices-payments", invoicesPaymentsRouter);
app.use("/departments", departmentsRouter);
app.use("/property-types", propertyTypesRouter);
app.use("/projects", projectsRouter);
app.use("/buildings", buildingsRouter);
app.use("/floors", floorsRouter);
app.use("/units", unitsRouter);
app.use("/notifications", notificationsRouter);
app.use("/meetings", meetingsRouter);
app.use("/reports", reportsRouter);
app.use("/salespersons", salespersonsRouter);
app.use("/issues", issuesRouter);
app.use("/balances", balancesRouter);
app.use("/v1/fast-pay", fastPayRouter);
app.use("/v1/hyperpay", hyperPayRouter);
app.use("/payment", hyperPayRouter); // For result endpoint
app.use("/welcomescreen-media", welcomescreenMediaRouter);
app.use("/transactions", transactionsRouter);
app.use("/general-configurations", generalConfigurationsRouter);
app.use("*", notFoundHandler);
app.use(errorHandler);

httpServer.listen(port, host, () => {
  console.log("Server listening on host %s and port %s...", port, host);
});

httpServer.on("error", (error: unknown) => {
  console.error(error);
});
