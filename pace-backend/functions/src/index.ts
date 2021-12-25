import * as functions from "firebase-functions";

import { app } from "./app";

/**
 * Function exposing the backend
 */
export const api = functions.region("europe-west1").https.onRequest(app);

/**
 * Event handlers
 */
export * from "./api/users/users.event-handlers";
export * from "./api/projects/projects.event-handlers";
export * from "./api/invitations/invitations.event-handlers";
export * from "./api/milestones/milestones.event-handlers";
