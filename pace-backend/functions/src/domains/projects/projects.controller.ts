import { validationResult } from "express-validator";
import { HttpStatusCode } from "../../shared/enums/http-status-codes.enum";
import { sendResponse } from "../../utils/http";
import { mapRequestObjectToModel } from "../../utils/objects";
import { paceLoggingService } from "../../utils/services/logger";
import { invitationService } from "../invitations/invitations.service";
import { Project } from "./projects.model";
import { projectService } from "./projects.service";

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

  paceLoggingService.log(`projects/${id}/delete`);

  const response = await projectService.getProjectAndValidatePermissions(userId, id);
  if (response.error) {
    paceLoggingService.error(`Error while deleting project ${response.error}`);
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      error: response.error,
    });
  }

  try {
    const deleteResponse = await projectService.deleteProject(id);
    if (response.error) return sendResponse(res, HttpStatusCode.BAD_REQUEST, deleteResponse);
    return sendResponse(res, HttpStatusCode.OK, deleteResponse);
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
  paceLoggingService.log(`projects/${id}/update`, { data: req.body });

  const response = await projectService.getProjectAndValidatePermissions(userId, id);
  if (response.error) {
    paceLoggingService.error(`Error while updating project ${response.error}`);
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      error: response.error,
    });
  }

  const updateData = mapRequestObjectToModel<Partial<Project>>(Project, req);
  try {
    const projectRes = await projectService.updateProject(id, updateData);
    if (response.error) return sendResponse(res, HttpStatusCode.BAD_REQUEST, projectRes);
    return sendResponse(res, HttpStatusCode.OK, projectRes);
  } catch (err) {
    paceLoggingService.error("Error while creating the project", { error: err });
    sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}

/**
 * @param {any} req
 * @param {any} res
 */
export async function inviteMember(req: any, res: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      errors: errors.array(),
    });

  const { id } = req.params;
  const { user_id: userId } = req.user;
  const { email, role: invitedUserRole, projectName, invitedBy } = req.body;

  paceLoggingService.log(`projects/${id}/invite-member`, { data: req.body });

  try {
    const response = await projectService.getProjectAndValidatePermissions(userId, id);
    if (response.error && !response.project) {
      paceLoggingService.error(`Error while creating invitation ${response.error}`, { projectId: id });
      return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
        error: response.error,
      });
    }
    const { project } = response;
    const invitationRes = await invitationService.createInvitation(
      project!.uid,
      email,
      invitedUserRole,
      projectName,
      invitedBy
    );

    if (invitationRes.error) return sendResponse(res, HttpStatusCode.BAD_REQUEST, invitationRes);
    sendResponse(res, HttpStatusCode.CREATED, { success: true });
  } catch (err) {
    paceLoggingService.error("Error while creating the invitation", { error: err });
    sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }

  paceLoggingService.log(`projects/${id}/invite-member`, email);
}

/**
 * @param {any} req
 * @param {any} res
 */
export async function leaveProject(req: any, res: any) {
  const { id } = req.params;
  const { user_id: userId } = req.user;
  paceLoggingService.log(`projects/${id}/leave`);

  try {
    const response = await projectService.leaveProject(userId, id);
    if (response.error) return sendResponse(res, HttpStatusCode.BAD_REQUEST, response);
    return sendResponse(res, HttpStatusCode.OK, response);
  } catch (err) {
    paceLoggingService.error("Error while leaving the project", { error: err });
    sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}
