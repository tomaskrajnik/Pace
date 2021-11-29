import { Router } from "express";
import { validateFirebaseIdToken } from "../../shared/middleware/auth.middleware";
import { validateRequest, ValidationRouteTypes } from "../../utils/validation";
import { createMilestone, deleteMilestone } from "./milestones.controller";

const milestonesRouter = Router();

/**
 * @typedef Milestone
 * @property {string} uid
 * @property {string} name
 * @property {string[]} subtasks
 * @property {number} createdAt
 * @property {number} startDate
 * @property {number} endDate
 * @property {string} description
 * @property {string} color
 */

/**
 * Create new milestone
 * @route POST /milestones/create
 * @group Milestones - API for milestones
 * @param {Milestone.model} req.body.required
 * @returns {Milestone.model} 200 Miletone model
 */
milestonesRouter.post(
  "/create",
  validateRequest(ValidationRouteTypes.CreateMilestone),
  validateFirebaseIdToken,
  createMilestone
);

/**
 * Update milestone
 * @route PUT /milestones/update/:id
 * @group Milestones - API for milestones
 * @param {string} id.query.required Id of milestone
 * @param {Milestone.model} updateDate.body.required Patial Milestone model
 * @returns {boolean} 200 success
 */
milestonesRouter.put("/update/:id", validateRequest(ValidationRouteTypes.UpdateMilestone), validateFirebaseIdToken);

/**
 * Delete milestone
 * @route Delete /milestones/delete/:id
 * @group Milestones - API for milestones
 * @param {string} id.query.required Id of milestone
 * @returns {boolean} 200 success
 */
milestonesRouter.delete("/delete/:id", validateFirebaseIdToken, deleteMilestone);

export { milestonesRouter };
