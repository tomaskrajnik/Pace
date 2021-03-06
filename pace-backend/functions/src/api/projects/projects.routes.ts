import { Router } from "express";
import { validateFirebaseIdToken } from "../../shared/middleware/auth.middleware";
import { validateRequest, ValidationRouteTypes } from "../../utils/validation";
import {
  createProject,
  deleteProject,
  inviteMember,
  leaveProject,
  removeMemberFromProject,
  updateProject,
} from "./projects.controller";

const projectsRouter = Router();

/**
 * @typedef ProjectMember
 * @property {string} uid
 * @property {string} name
 * @property {string} role enum "owner" | "editor" | "viewer"
 * @property {string} photoUrl
 */

/**
 * @typedef Project
 * @property {string} uid
 * @property {string} name
 * @property {number} createdAt
 * @property {string[]} milestones
 * @property {string} members
 * @property {string} photoUrl
 */

/**
 * @typedef CreateProjectRequest
 * @property {string} name
 * @property {string} photoUrl
 */

/**
 * @typedef UpdateProjectRequest
 * @property {string} name
 * @property {string} photoUrl
 */

/**
 * @typedef CreateInvitationRequest
 * @property {string} email
 * @property {string} role enum "viewer" | "editor" | "owner"
 */

/**
 * Create new project
 * @route POST /projects/create
 * @group Projects - API for Pace projects manipulation
 * @param {CreateProjectRequest.model} project.body.required
 * @returns {Project.model} 200 Newly created project
 */
projectsRouter.post(
  "/create",
  validateRequest(ValidationRouteTypes.CreateProject),
  validateFirebaseIdToken,
  createProject
);

/**
 * Delete project
 * @route DELETE /projects/delete/:id
 * @group Projects - API for Pace projects manipulation
 * @param {string} id.query.required Id of the project
 */
projectsRouter.delete("/delete/:id", validateFirebaseIdToken, deleteProject);

/**
 * Update project
 * @route PUT /projects/update/:id
 * @group Projects - API for Pace projects manipulation
 * @param {UpdateProjectRequest.model} data.body.required Update project request
 * @param {string} id.query.required Id of the project
 */
projectsRouter.put(
  "/update/:id",
  validateFirebaseIdToken,
  validateRequest(ValidationRouteTypes.UpdateProject),
  updateProject
);

/**
 * Invite user to project
 * @route POST /projects/:id/invite-member
 * @group Projects - API for Pace projects manipulation
 * @param {string} id.query.required Id of the project
 * @param {CreateInvitationRequest.model} invitation.body.request
 */
projectsRouter.post(
  "/:id/invite-member",
  validateFirebaseIdToken,
  validateRequest(ValidationRouteTypes.InviteUser),
  inviteMember
);

/**
 * Leave project
 * @route POST /projects/:id/leave
 * @group Projects - API for Pace projects manipulation
 * @param {string} id.query.required Id of the project
 */
projectsRouter.get("/:id/leave", validateFirebaseIdToken, leaveProject);

/**
 * Remove member from project
 * @route POGetST /projects/:id/remove/:id
 * @group Projects - API for Pace projects manipulation
 * @param {string} id.query.required Id of the project
 * @param {string} userId.query.required Id of the user
 */
projectsRouter.get("/:id/remove/:userId", validateFirebaseIdToken, removeMemberFromProject);

export { projectsRouter };
