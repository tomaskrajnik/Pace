import * as express from "express";
import router from "./app.router";
import * as cors from "cors";
import { swaggerUrl } from "./shared/constants";

const app: express.Application = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/v1", router);

/**
 * API docs using Swagger
 * this needs to be here
 */
const expressSwagger = require("express-swagger-generator")(app);
const options = {
  swaggerDefinition: {
    info: {
      description: "This is the Pace API",
      title: "Swagger",
      version: "1.0.0",
    },
    basePath: "api/v1",
    produces: ["application/json", "application/xml"],
    schemes: ["http", "https"],
  },
  route: {
    url: swaggerUrl,
    docs: swaggerUrl + "/api-docs.json",
  },
  basedir: __dirname,
  files: ["./domains/**/*.router.js"], // Path to the API handle folder
};

expressSwagger(options);

export { app };
