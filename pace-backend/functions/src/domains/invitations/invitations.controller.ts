import { HttpStatusCode } from "../../shared/enums/http-status-codes.enum";
import { sendResponse } from "../../utils/http";
import { paceLoggingService } from "../../utils/services/logger";
import { invitationService } from "./invitations.service";

/**
 * @param {any} req
 * @param {any} res
 */
export async function acceptInvitation(req: any, res: any) {
  const { id } = req.params;
  if (!id) {
    paceLoggingService.error("Invitation id not provided");
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, { error: "Invitationd id not provided" });
  }
  const { user_id: userId } = req.user;

  paceLoggingService.log(`invitations/${id}/accept`);

  try {
    const response = await invitationService.acceptInvitation(userId, id);
    if (response.error) {
      return sendResponse(res, HttpStatusCode.BAD_REQUEST, response.error);
    }
    sendResponse(res, HttpStatusCode.OK, response);
  } catch (err) {
    paceLoggingService.error("Error while accepting the invitationn", { error: err });
    sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}

/**
 * @param {any} req
 * @param {any} res
 */
export async function declineInvitation(req: any, res: any) {
  const { id } = req.params;
  if (!id) {
    paceLoggingService.error("Invitation id not provided");
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, { error: "Invitationd id not provided" });
  }
  const { user_id: userId } = req.user;

  paceLoggingService.log(`invitations/${id}/decline`);

  try {
    const response = await invitationService.declineInvitation(userId, id);
    if (response.error) {
      return sendResponse(res, HttpStatusCode.BAD_REQUEST, response.error);
    }
    sendResponse(res, HttpStatusCode.OK, response);
  } catch (err) {
    paceLoggingService.error("Error while accepting the invitationn", { error: err });
    sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}

/**
 * @param {any} req
 * @param {any} res
 */
export async function deleteInvitation(req: any, res: any) {
  const { id } = req.params;
  if (!id) {
    paceLoggingService.error("Invitation id not provided");
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, { error: "Invitationd id not provided" });
  }
  const { user_id: userId } = req.user;

  paceLoggingService.log(`invitations/${id}/delete`);

  const userCanDeleteInvitation = await invitationService.userCanDeleteInvitation(userId, id);
  if (!userCanDeleteInvitation) return sendResponse(res, HttpStatusCode.BAD_REQUEST, { error: "Not authorizes" });
  try {
    const response = await invitationService.deleteInvitation(id);
    if (response.error) {
      return sendResponse(res, HttpStatusCode.BAD_REQUEST, response.error);
    }
    sendResponse(res, HttpStatusCode.OK, response);
  } catch (err) {
    paceLoggingService.error("Error while accepting the invitationn", { error: err });
    sendResponse(res, HttpStatusCode.INTERNAL_SERVER, err);
  }
}
