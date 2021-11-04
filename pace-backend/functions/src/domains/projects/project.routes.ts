import { Router } from "express";
import { validateFirebaseIdToken } from "../../shared/middleware/auth.middleware";
import { validateRequest, ValidationRouteTypes } from "../../utils/validation";
import { createProject, deleteProject, updateProject } from "./project.controller";

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
 * @route PUT /projects/delete/:id
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

export { projectsRouter };
