import Controller from "@/api/controllers";
import express from "express";
import LoggerController from "./logger";

const app = express();
app.use(LoggerController);
app.get("*", Controller);

export default app;
