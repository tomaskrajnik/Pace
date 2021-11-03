import { Router } from "express";
import { validateFirebaseIdToken } from "../../shared/middleware/auth.middleware";
import { validateRequest, ValidationRouteTypes } from "../../utils/validation";
import { createProject } from "./project.controller";

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

export { projectsRouter };
