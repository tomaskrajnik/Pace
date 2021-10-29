import { validationResult } from "express-validator";
import { HttpStatusCode } from "../../shared/enums/http-status-codes.enum";
import { paceLoggingService } from "../../utils/services/logger";
import { sendResponse } from "../../utils/http";
import { authService } from "../auth/auth.service";
import { userService } from "./users.service";
import { User } from "./users.model";
import { mapRequestObjectToModel } from "../../utils/objects";

/**
 * @param  {any} req
 * @param  {any} res
 */
export async function signup(req: any, res: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      errors: errors.array(),
    });

  paceLoggingService.log("users/signup", { signupData: req.body });

  const {
    body: { uid, name, email, companyName, jobTitle, photoUrl },
  } = req;

  try {
    const response = await authService.signup({ uid, name, email, companyName, jobTitle, photoUrl });
    if (response.error) return sendResponse(res, HttpStatusCode.BAD_REQUEST, response);
    return sendResponse(res, HttpStatusCode.CREATED, response);
  } catch (err) {
    paceLoggingService.error("Error while signing up", { error: err });
    return sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}

/**
 * @param  {any} req
 * @param  {any} res
 */
export async function getCurrentUser(req: any, res: any) {
  const {
    user: { user_id: uid },
  } = req;
  paceLoggingService.log("users/current", { uid });
  try {
    const user = await userService.findUserInFirestore(uid);
    if (!user)
      return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
        error: "Something went wrong while getting current user",
      });

    return sendResponse(res, HttpStatusCode.OK, { user: { uid, ...user } });
  } catch (err) {}
}

/**
 * @param  {any} req
 * @param  {any} res
 */
export async function isRegistered(req: any, res: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      errors: errors.array(),
    });

  const { email } = req.body;
  paceLoggingService.log("users/registered", { email });

  try {
    const user = await userService.findUserInFirebaseByEmail(email);
    const registered = user ? true : false;
    return sendResponse(res, HttpStatusCode.OK, { registered });
  } catch (err) {
    paceLoggingService.error("Error - users/registered", { error: err });
    return sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}

/**
 * @param  {any} req
 * @param  {any} res
 */
export async function updateUser(req: any, res: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      errors: errors.array(),
    });

  paceLoggingService.log("users/update", req.body);

  const uid = req.user.uid;
  const updateData = mapRequestObjectToModel<Partial<User>>(User, req);

  try {
    const response = await userService.updateUserData(uid, updateData);
    if (response.error) return sendResponse(res, HttpStatusCode.BAD_REQUEST, response);
    sendResponse(res, HttpStatusCode.OK, response);
  } catch (err) {
    paceLoggingService.error(`Error - users/update/${uid}`, { error: err.message });
    return sendResponse(res, HttpStatusCode.INTERNAL_SERVER, { error: err.message });
  }
}

/**
 * @param  {any} req
 * @param  {any} res
 */
export async function requestPasswordReset(req: any, res: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      errors: errors.array(),
    });

  const { email } = req.body;
  paceLoggingService.log("users/request-password-reset", email);

  try {
    const user = await userService.findUserInFirebaseByEmail(email);
    if (!user)
      return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
        errors: "User with this email is not registered",
      });

    const link = await authService.generatePasswordResetLink(email);
    paceLoggingService.log(link);
    //TODO send email to the user
    return sendResponse(res, HttpStatusCode.OK, { success: true });
  } catch (err) {
    paceLoggingService.error(`Error - users/request-password-reset/${email}`, { error: err });
    return sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}

/**
 * @param  {any} req
 * @param  {any} res
 */
export async function deleteUser(req: any, res: any) {
  const { id: uid } = req.params;

  paceLoggingService.log("users/delete", uid);

  if (!uid)
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
      errors: "No user id provided.",
    });

  const response = await userService.deleteUser(uid);
  if (response.error) return sendResponse(res, HttpStatusCode.BAD_REQUEST, response.error);
  return sendResponse(res, HttpStatusCode.OK, response);
}
