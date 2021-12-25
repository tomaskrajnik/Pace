import * as functions from "firebase-functions";
import { databaseCollections } from "../../shared/enums/database-collections.enum";
import { authService } from "../auth/auth.service";
import { projectService } from "../projects/projects.service";
import { subtasksService } from "../subtasks/subtasks.service";

export const userUpdated = functions
  .region("europe-west1")
  .firestore.document(`${databaseCollections.USERS}/{userId}`)
  .onUpdate(async (change, context) => {
    const promises = [
      authService.updateFirebaseAuthUser(change, context),
      projectService.updateProjectMemberDataOnuserUpdate(change, context),
      subtasksService.updateSubtasksMembers(change, context),
    ];
    await Promise.all(promises);
  });
export const userDeleted = functions
  .region("europe-west1")
  .firestore.document(`${databaseCollections.USERS}/{userId}`)
  .onDelete((snapshot, context) => authService.deleteFirebaseAuthUser(snapshot, context));
