import { Router } from "express";
import { validateFirebaseIdToken } from "../../shared/middleware/auth.middleware";
import { validateRequest, ValidationRouteTypes } from "../../utils/validation";
import { getCurrentUser, requestPasswordReset, signup } from "./users.controller";

const userRouter = Router();

/**
 * @typedef User
 * @property {string} uid
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} photUrl
 * @property {boolean} emailVerified
 * @property {number} createdAt
 * @property {string} companyName
 * @property {string} jobTitle
 */

/**
 * @typedef SignUpRequest
 * @property {string} uid
 * @property {string} name
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef SignUpResponse
 * @property {string} access_token
 * @property {object} user
 */

/**
 * Sing up user
 * @route POST /users/signup
 * @param {SignUpRequest.model}
 * @returns {SignupResponse.model}
 */
userRouter.post("/signup", validateRequest(ValidationRouteTypes.Signup), signup);

/**
 * Get current user
 * @route GET /users/current
 * @returns {User.model} user
 */
userRouter.get("/current", validateFirebaseIdToken, getCurrentUser);

/**
 * Generate and sends password reset link to the user
 * The rest is handled by Google auth
 * @route POST /users/password-reset-link
 * @returns {void}
 */
userRouter.post(
  "/request-password-reset/",
  validateRequest(ValidationRouteTypes.RequestPasswordReset),
  requestPasswordReset
);

/**
 * Delete user
 * @route DELETE /users/:id
 * @returns {void}
 */
userRouter.delete;

export { userRouter };
