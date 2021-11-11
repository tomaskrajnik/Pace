import * as functions from "firebase-functions";

import { app } from "./app";

/**
 * Function exposing the backend
 */
export const api = functions.region("europe-west1").https.onRequest(app);

/**
 * Event handlers
 */
export * from "./domains/users/users.event-handlers";
export * from "./domains/projects/projects.event-handlers";
export * from "./domains/invitations/invitations.event-handlers";
