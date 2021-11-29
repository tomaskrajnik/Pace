import * as functions from "firebase-functions";
import { databaseCollections } from "../../shared/enums/database-collections.enum";
import { projectService } from "../projects/projects.service";

export const milestoneCreated = functions
  .region("europe-west1")
  .firestore.document(`${databaseCollections.MILESTONES}/{milestoneId}`)
  .onCreate((snapshot, context) => projectService.updateMilestonesInProject(snapshot, context));
export const milestoneDeleted = functions
  .region("europe-west1")
  .firestore.document(`${databaseCollections.MILESTONES}/{milestoneId}`)
  .onDelete((snapshot, context) => projectService.updateMilestonesInProject(snapshot, context));
