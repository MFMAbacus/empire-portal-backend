import mongoose from "mongoose";
import { dbUrl } from "@/config/app";
require("dotenv").config();

export const connection = () => {
  mongoose
    .connect(dbUrl)
    .then(() => {
      console.log("DB Connetion Successfull");
    })
    .catch((err: unknown) => {
      console.log(err);
    });
};
