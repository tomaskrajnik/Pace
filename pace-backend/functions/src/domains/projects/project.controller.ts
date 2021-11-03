import { validationResult } from "express-validator";
import { HttpStatusCode } from "../../shared/enums/http-status-codes.enum";
import { sendResponse } from "../../utils/http";
import { paceLoggingService } from "../../utils/services/logger";
import { projectService } from "./project.service";

/**
 * @param  {any} req
 * @param  {any} res
 */
export async function createProject(req: any, res: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      errors: errors.array(),
    });
  paceLoggingService.log("projects/create", { project: req.body });
  const { name, photoUrl } = req.body;
  const userId = req.user.user_id;

  try {
    const response = await projectService.createProject({ name, photoUrl: photoUrl ?? "", userId });
    if (response.error) return sendResponse(res, HttpStatusCode.BAD_REQUEST, response);
    return sendResponse(res, HttpStatusCode.CREATED, response);
  } catch (err) {
    paceLoggingService.error("Error while creating the project", { error: err });
    sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}
