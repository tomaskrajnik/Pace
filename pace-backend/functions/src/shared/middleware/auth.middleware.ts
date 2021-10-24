import { sendResponse } from "../../utils/http";
import { paceLoggingService } from "../../utils/services/logger";
import { fbAdmin } from "../database/admin";
import { HttpStatusCode } from "../enums/http-status-codes.enum";

/**
 * validateFirebaseIdToken
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
export function validateFirebaseIdToken(req: any, res: any, next: any) {
  paceLoggingService.log("Check if request is authorized with Firebase ID token");

  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    paceLoggingService.error(
      "No Firebase ID token was passed as a Bearer token in the Authorization header." +
        "Make sure you authorize your request by providing the following HTTP header: " +
        "Authorization: Bearer <Firebase ID Token> "
    );
    return sendResponse(res, HttpStatusCode.FORBIDDEN, { error: "Unauthorized" });
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    paceLoggingService.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split("Bearer ")[1];
  }
  fbAdmin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedIdToken) => {
      paceLoggingService.log("ID Token correctly decoded", { decodedIdToken });
      req.user = decodedIdToken;
      next();
    })
    .catch((error) => {
      paceLoggingService.error("Error while verifying Firebase ID token:", error);
      return sendResponse(res, HttpStatusCode.FORBIDDEN, { error: "Unauthorized" });
    });
}

/**
 * validateUserHasAccess
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
export function validateUserHasAccess(req: any, res: any, next: any) {
  paceLoggingService.log("Check if user is authorized to access the users data ");
  const { uid } = req.params;
  const { user_id } = req;
  if (!uid || !user_id) {
    paceLoggingService.error("No uid or id token provided");
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, { error: "No uid or id token provided" });
  }

  if (uid !== user_id) {
    paceLoggingService.error("Unauthorized to access this endpoint", { uid, userID: user_id });
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, { error: "Unauthorized to access this endpoint" });
  }

  next();
}
