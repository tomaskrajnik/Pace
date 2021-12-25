import { Router } from "express";
import { validateFirebaseIdToken, validateUserHasAccess } from "../../shared/middleware/auth.middleware";
import { validateRequest, ValidationRouteTypes } from "../../utils/validation";
import { deleteUser, getCurrentUser, requestPasswordReset, signup, updateUser } from "./users.controller";

const userRouter = Router();

/**
 * @typedef PaceUser
 * @property {string} uid
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} photUrl
 * @property {boolean} emailVerified
 * @property {number} createdAt
 * @property {string} companyName
 * @property {string} jobTitle
 * @property {string[]} projects
 */

/**
 * @typedef SignUpRequest
 * @property {string} uid
 * @property {string} name
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef RequestPasswordResetResponse
 * @property {boolean} success
 */

/**
 * @typedef UpdateUserResponse
 * @property {boolean} success
 */

/**
 * Sing up and create Pace user
 * @route POST /users/signup
 * @group User - API for Pace users
 * @param {SignUpRequest.model} req.body.required
 * @returns {PaceUser.model} 200 Pace user model
 */
userRouter.post("/signup", validateRequest(ValidationRouteTypes.Signup), signup);

/**
 * Get current user
 * @route GET /users/current
 * @group User - API for Pace users
 * @returns {PaceUser.model} 200 Pace user model
 */
userRouter.get("/current", validateFirebaseIdToken, getCurrentUser);

/**
 * Generate and sends password reset link to the user
 * @route POST /users/password-reset-link
 * @group User - API for Pace users
 * @param {string} email.body.required
 * @returns {RequestPasswordResetResponse.model} 200 success
 */
userRouter.post(
  "/request-password-reset",
  validateRequest(ValidationRouteTypes.RequestPasswordReset),
  requestPasswordReset
);

/**
 * Update user data
 * @route PUT /users/update/:id
 * @group User - API for Pace users
 * @param {string} id.query.required Id of Pace user
 * @param {PaceUser.model} updateData.body.required Partial user model
 * @returns {UpdateUserResponse.model} 200 success
 */
userRouter.put(
  "/update/:id",
  validateRequest(ValidationRouteTypes.UpdateUserInfo),
  validateFirebaseIdToken,
  validateUserHasAccess,
  updateUser
);

/**
 * Delete user
 * @route DELETE /users/:id
 * @group User - API for Pace users
 * @param {string} id.query.required Id of Pace user
 */
userRouter.delete("/users/:id", validateFirebaseIdToken, validateUserHasAccess, deleteUser);

export { userRouter };
