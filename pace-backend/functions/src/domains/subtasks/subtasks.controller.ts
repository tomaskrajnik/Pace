import { validationResult } from "express-validator";
import { HttpStatusCode } from "../../shared/enums/http-status-codes.enum";
import { sendResponse } from "../../utils/http";
import { mapRequestObjectToModel } from "../../utils/objects";
import { paceLoggingService } from "../../utils/services/logger";
import { milesoneService } from "../milestones/milestones.service";
import { Subtask } from "./subtasks.model";
import { subtasksService } from "./subtasks.service";

/**
 * @param  {any} req
 * @param  {any} res
 */
export async function createSubtask(req: any, res: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      errors: errors.array(),
    });
  paceLoggingService.log("subtasks/create", { subtask: req.body });

  const { name, milestoneId, status, assignee, description } = req.body;
  const userId = req.user.user_id;

  const permissionsResponse = await milesoneService.getMilestoneAndValidatePermission(userId, milestoneId);
  if (permissionsResponse.error) {
    paceLoggingService.error(`Error while creating subtasks ${permissionsResponse.error}`);
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      error: permissionsResponse.error,
    });
  }

  try {
    const response = await subtasksService.createSubtask({ name, milestoneId, status, assignee, description }, userId);

    if (response.error) return sendResponse(res, HttpStatusCode.BAD_REQUEST, response);
    return sendResponse(res, HttpStatusCode.CREATED, response);
  } catch (err) {
    paceLoggingService.error("Error while creating subtask", { error: err });
    sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}

/**
 * @param  {any} req
 * @param  {any} res
 */
export async function updateSubtask(req: any, res: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      errors: errors.array(),
    });

  const { subtask_id } = req.subtask;
  paceLoggingService.log(`subtasks/update/${subtask_id}`, { updateData: req.body });

  const updateData = mapRequestObjectToModel<Partial<Subtask>>(Subtask, req);

  if (req.body.assignee === "unassigned") updateData.assignee = null;

  try {
    const response = await subtasksService.updateSubtask(subtask_id, updateData);
    if (response.error) return sendResponse(res, HttpStatusCode.BAD_REQUEST, response);
    return sendResponse(res, HttpStatusCode.OK, response);
  } catch (err) {
    paceLoggingService.error("Error while updating subtask", { error: err });
    sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}

/**
 * @param  {any} req
 * @param  {any} res
 */
export async function deleteSubtask(req: any, res: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      errors: errors.array(),
    });

  const { subtask_id } = req.subtask;
  paceLoggingService.log(`subtasks/delete/${subtask_id}`);

  try {
    const response = await subtasksService.deleteSubtask(subtask_id);
    if (response.error) return sendResponse(res, HttpStatusCode.BAD_REQUEST, response);
    return sendResponse(res, HttpStatusCode.OK, response);
  } catch (err) {
    paceLoggingService.error("Error while deleting subtask", { error: err });
    sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}
