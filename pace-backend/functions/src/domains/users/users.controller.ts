import { validationResult } from "express-validator";
import { HttpStatusCode } from "../../shared/enums/http-status-codes.enum";
import { paceLoggingService } from "../../utils/services/logger";
import { sendResponse } from "../../utils/http";
import { authService } from "../auth/auth.service";
import { userService } from "./users.service";
import { User } from "./users.model";
import { AtLeastOne } from "../../utils/types";

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
    paceLoggingService.error("Error while signing up", err);
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

  try {
    const user = await userService.findUserInFirestore(uid);
    if (!user)
      return sendResponse(res, HttpStatusCode.BAD_REQUEST, {
        error: "Something went wrong while getting current user",
      });
    return sendResponse(res, HttpStatusCode.CREATED, { ...user, uid });
  } catch (err) {}
}

/**
 * @param  {any} req
 * @param  {any} res
 */
export async function registered(req: any, res: any) {
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
    paceLoggingService.error("Error - users/registered", err);
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
  const data: AtLeastOne<User> = req.body;

  try {
    const response = userService.updateUserData(uid, { ...data });
    sendResponse(res, HttpStatusCode.OK, response);
  } catch (err) {
    paceLoggingService.error(`Error - users/update/${uid}`, err);
    return sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}
