import { Router } from "express";
import { validateFirebaseIdToken } from "../../shared/middleware/auth.middleware";
import { acceptInvitation } from "./invitations.controller";

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
invitationsRouter.get("/:id/decline", validateFirebaseIdToken);

export { invitationsRouter };
