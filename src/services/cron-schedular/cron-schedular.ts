const cron = require("node-cron");
import { cronTimeConfig } from "@/config/app";
import { checkFibPaymentStatus } from "../check-fib-payment-status";

export const CronSchedular = () => {
  const cronTime = cronTimeConfig || "* * * * *";
  if (!cron.validate(cronTime)) {
    throw new Error("Invalid cron time format.");
  }

  console.log(`Scheduling cron job with time: ${cronTime}`);
  cron.schedule(cronTime, () => checkFibPaymentStatus.execute());
};
