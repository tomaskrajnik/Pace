import * as express from "express";
import router from "./app.router";
import * as cors from "cors";
import { config } from "./config/config-dev";

const app: express.Application = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/v1", router);

// swagger docs
const expressSwagger = require("express-swagger-generator")(app);
expressSwagger(config.swaggerConfig);

export { app };
