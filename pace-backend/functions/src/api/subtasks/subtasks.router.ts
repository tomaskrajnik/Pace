import { Router } from "express";
import { validateFirebaseIdToken } from "../../shared/middleware/auth.middleware";
import { validateUserHasPermissionToManipulateSubtask } from "../../shared/middleware/subtasks.middleware";
import { validateRequest, ValidationRouteTypes } from "../../utils/validation";
import { createSubtask, deleteSubtask, updateSubtask } from "./subtasks.controller";

const subtasksRouter = Router();

/**
 * @typedef SubtasksMember
 * @property {string} uid
 * @property {string} name
 * @property {string} photoUrl
 * @property {string} avatarColor
 */

/**
 * @typedef Subtask
 * @property {string} uid
 * @property {string} name
 * @property {number} createdAt
 * @property {string} milestoneId
 * @property {string} status enum SubtaskSatus Done | InProgress | ToDo
 * @property {SubtasksMember.model} assignee
 * @property {SubtasksMember.model} reporter
 * @property {string} description
 */

/**
 * @typedef CreateSubtasktRequest
 * @property {string} name
 * @property {string} milestoneId
 * @property {string} status enum SubtaskSatus Done | InProgress | ToDo
 * @property {SubtasksMember.model} assignee
 * @property {string} description
 */

/**
 * @typedef UpdateSubtasksRequest
 * @property {string} name
 * @property {string} status enum SubtaskSatus Done | InProgress | ToDo
 * @property {SubtasksMember.model} assignee
 * @property {string} description
 */

/**
 * Create new subtask
 * @route POST /subtasks/create
 * @group Subtasks - API for Pace Subtasks manipulation
 * @param {CreateSubtasktRequest.model} subtask.body.required
 * @return {Subtask.model} 200 newly created subtask
 */
subtasksRouter.post(
  "/create",
  validateRequest(ValidationRouteTypes.CreateSubtask),
  validateFirebaseIdToken,
  createSubtask
);

/**
 * Update subtask
 * @route PUT /subtasks/update/:id
 * @group Subtasks - API for Pace Subtasks manipulation
 * @param {UpdateSubtasksRequest.model} updateData.body.required
 * @return {Subtask.model} 200 updated subtask
 */
subtasksRouter.put(
  "/update/:id",
  validateRequest(ValidationRouteTypes.UpdateSubtask),
  validateFirebaseIdToken,
  validateUserHasPermissionToManipulateSubtask,
  updateSubtask
);

/**
 * Delete subtask
 * @route DElETE /subtasks/delete/:id
 * @group Subtasks - API for Pace Subtasks manipulation
 * @param {string} id.query.required Id of the subtask
 * @return {boolean} 200 success
 */
subtasksRouter.delete(
  "/delete/:id",
  validateFirebaseIdToken,
  validateUserHasPermissionToManipulateSubtask,
  deleteSubtask
);

export { subtasksRouter };
