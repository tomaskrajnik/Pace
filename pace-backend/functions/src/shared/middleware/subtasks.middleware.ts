import { milesoneService } from "../../domains/milestones/milestones.service";
import { subtasksService } from "../../domains/subtasks/subtasks.service";
import { sendResponse } from "../../utils/http";
import { paceLoggingService } from "../../utils/services/logger";
import { HttpStatusCode } from "../enums/http-status-codes.enum";

export async function validateUserHasPermissionToManipulateSubtask(req: any, res: any, next: any) {
  const userId = req.user.user_id;
  const { id: subtask_id } = req.params;
  paceLoggingService.log(`Subtask middleware`, { subtask_id, userId });

  if (!subtask_id || !userId) {
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, { error: "User or subtask id not provided" });
  }

  const subtaskSnap = await subtasksService.findSubtaskInFirebase(subtask_id);
  if (!subtaskSnap) return { error: "Something went wrong" };

  req.subtask = { subtask_id };

  const milestone_id = subtaskSnap.milestoneId;
  const permissionsResponse = await milesoneService.getMilestoneAndValidatePermission(userId, milestone_id);
  if (permissionsResponse.error) {
    paceLoggingService.error(`Validation error ${permissionsResponse.error}`);
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      error: permissionsResponse.error,
    });
  }
  next();
}
