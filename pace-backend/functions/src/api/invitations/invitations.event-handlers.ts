import * as functions from "firebase-functions";
import { databaseCollections } from "../../shared/enums/database-collections.enum";
import { projectService } from "../projects/projects.service";

export const invitationCreated = functions
  .region("europe-west1")
  .firestore.document(`${databaseCollections.INVITATIONS}/{invitationId}`)
  .onCreate((snapshot, context) => projectService.updateInvitations(snapshot, context));
