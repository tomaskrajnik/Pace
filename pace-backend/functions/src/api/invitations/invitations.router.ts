import { Router } from "express";
import { validateFirebaseIdToken } from "../../shared/middleware/auth.middleware";
import { acceptInvitation, declineInvitation, deleteInvitation } from "./invitations.controller";

const invitationsRouter = Router();

/**
 * Accept invitation
 * @route POST /invitations/:id/accept
 * @group Invitations - API for Pace invitations manipulations
 * @property {string} id.query.required id of the invitation
 */
invitationsRouter.get("/:id/accept", validateFirebaseIdToken, acceptInvitation);

/**
 * Decline and delete invitation
 * @route POST /invitations/:id/decline
 * @group Invitations - API for Pace invitations manipulations
 * @property {string} id.query.required id of the invitation
 */
invitationsRouter.get("/:id/decline", validateFirebaseIdToken, declineInvitation);

/**
 * Delete invitation
 * @route DELETE /invitations/:id/delete
 * @group Invitations - API for Pace invitations manipulations
 * @property {string} id.query.required id of the invitation
 */
invitationsRouter.delete("/:id/delete", validateFirebaseIdToken, deleteInvitation);

export { invitationsRouter };
