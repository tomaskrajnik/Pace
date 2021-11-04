import { validationResult } from "express-validator";
import { HttpStatusCode } from "../../shared/enums/http-status-codes.enum";
import { sendResponse } from "../../utils/http";
import { mapRequestObjectToModel } from "../../utils/objects";
import { paceLoggingService } from "../../utils/services/logger";
import { Project } from "./project.model";
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

/**
 * @param {any} req
 * @param {any} res
 */
export async function deleteProject(req: any, res: any) {
  const { id } = req.params;
  const { user_id: userId } = req.user;
  if (!id) {
    paceLoggingService.error("Error while deleting project - no id provided");
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      error: "Project id not provided",
    });
  }
  paceLoggingService.log("projects/delete", id);

  const project = await projectService.findProjectInFirestore(id);
  if (!project) {
    paceLoggingService.error("Error while deleting project - project with the id does not exist", id);
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      error: "Project with provided id does not exist",
    });
  }
  const userHasPermission = await projectService.userHasPermissionToManipulateProject(userId, project);
  if (!userHasPermission) {
    paceLoggingService.error("Error while deleting project - user does not have permission", {
      data: { userId, project },
    });
    return sendResponse(res, HttpStatusCode.UNAUTHORIZED, {
      error: "Unautorized",
    });
  }
  try {
    const response = await projectService.deleteProject(id);
    if (response.error) return sendResponse(res, HttpStatusCode.BAD_REQUEST, response);
    return sendResponse(res, HttpStatusCode.OK, response);
  } catch (err) {
    paceLoggingService.error("Error while creating the project", { error: err });
    sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}

/**
 * @param {any} req
 * @param {any} res
 */
export async function updateProject(req: any, res: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      errors: errors.array(),
    });

  const { id } = req.params;
  const { user_id: userId } = req.user;

  if (!id) {
    paceLoggingService.error("Error while deleting project - no id provided");
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      error: "Project id not provided",
    });
  }
  paceLoggingService.log("projects/update", id);

  const project = await projectService.findProjectInFirestore(id);
  if (!project) {
    paceLoggingService.error("Error while deleting project - project with the id does not exist", id);
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      error: "Project with provided id does not exist",
    });
  }
  const userHasPermission = await projectService.userHasPermissionToManipulateProject(userId, project);
  if (!userHasPermission) {
    paceLoggingService.error("Error while deleting project - user does not have permission", {
      data: { userId, project },
    });
    return sendResponse(res, HttpStatusCode.UNAUTHORIZED, {
      error: "Unautorized",
    });
  }

  const updateData = mapRequestObjectToModel<Partial<Project>>(Project, req);
  try {
    const response = await projectService.updateProject(id, updateData);
    if (response.error) return sendResponse(res, HttpStatusCode.BAD_REQUEST, response);
    return sendResponse(res, HttpStatusCode.OK, response);
  } catch (err) {
    paceLoggingService.error("Error while creating the project", { error: err });
    sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}
