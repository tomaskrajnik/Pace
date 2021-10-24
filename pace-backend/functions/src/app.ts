import * as express from "express";
import router from "./app.router";
import * as cors from "cors";

const app: express.Application = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/v1", router);

export { app };
