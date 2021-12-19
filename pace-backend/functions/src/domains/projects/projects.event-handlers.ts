import * as functions from "firebase-functions";
import { databaseCollections } from "../../shared/enums/database-collections.enum";
import { userService } from "../users/users.service";
import { projectService } from "./projects.service";

export const projectCreated = functions
  .region("europe-west1")
  .firestore.document(`${databaseCollections.PROJECTS}/{projectId}`)
  .onCreate((snapshot, context) => userService.addInitialProjectToUser(snapshot, context));
export const projectDeleted = functions
  .region("europe-west1")
  .firestore.document(`${databaseCollections.PROJECTS}/{projectId}`)
  .onDelete((snapshot, context) => projectService.removeAllTracesAfterDelete(snapshot, context));
