import { validationResult } from "express-validator";
import { HttpStatusCode } from "../../shared/enums/http-status-codes.enum";
import { sendResponse } from "../../utils/http";
import { mapRequestObjectToModel } from "../../utils/objects";
import { paceLoggingService } from "../../utils/services/logger";
import { projectService } from "../projects/projects.service";
import { Milestone } from "./milestones.model";
import { milesoneService } from "./milestones.service";

/**
 * @param  {any} req
 * @param  {any} res
 */
export async function createMilestone(req: any, res: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      errors: errors.array(),
    });
  paceLoggingService.log("milestones/create", { milestone: req.body });
  const { name, projectId, description, color, startDate, endDate } = req.body;
  const userId = req.user.user_id;

  const response = await projectService.getProjectAndValidatePermissions(userId, projectId);
  if (response.error) {
    paceLoggingService.error(`Error while creating milestone ${response.error}`);
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      error: response.error,
    });
  }

  try {
    const createResponse = await milesoneService.createMilestone({
      name,
      projectId,
      description,
      color,
      startDate,
      endDate,
    });
    if (createResponse.error) return sendResponse(res, HttpStatusCode.BAD_REQUEST, createResponse);
    return sendResponse(res, HttpStatusCode.CREATED, createResponse);
  } catch (err) {
    paceLoggingService.error("Error while creating the milestone", { error: err });
    sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}

/**
 * @param  {any} req
 * @param  {any} res
 */
export async function updateMilestone(req: any, res: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      errors: errors.array(),
    });

  const { id } = req.params;
  const { user_id: userId } = req.user;
  paceLoggingService.log(`milestones/${id}/update`, { data: req.body });

  const response = await milesoneService.getMilestoneAndValidatePermission(userId, id);
  if (response.error) {
    paceLoggingService.error(`Error while deleting milestone ${response.error}`);
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      error: response.error,
    });
  }

  const updateData = mapRequestObjectToModel<Partial<Milestone>>(Milestone, req);
  try {
    const deleteResponse = await milesoneService.updateMilestone(id, updateData);
    if (deleteResponse.error) return sendResponse(res, HttpStatusCode.BAD_REQUEST, deleteResponse);
    return sendResponse(res, HttpStatusCode.OK, deleteResponse);
  } catch (err) {
    paceLoggingService.error("Error while updating the milestone", { error: err });
    sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}

/**
 * @param  {any} req
 * @param  {any} res
 */
export async function deleteMilestone(req: any, res: any) {
  const { id } = req.params;
  const { user_id: userId } = req.user;
  paceLoggingService.log(`milestones/${id}/delete`);

  const response = await milesoneService.getMilestoneAndValidatePermission(userId, id);
  if (response.error) {
    paceLoggingService.error(`Error while deleting milestone ${response.error}`);
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      error: response.error,
    });
  }

  try {
    const deleteResponse = await milesoneService.deleteMilestone(id);
    if (deleteResponse.error) return sendResponse(res, HttpStatusCode.BAD_REQUEST, deleteResponse);
    return sendResponse(res, HttpStatusCode.OK, deleteResponse);
  } catch (err) {
    paceLoggingService.error("Error while deleting the milestone", { error: err });
    sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}
