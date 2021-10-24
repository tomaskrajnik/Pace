import * as functions from "firebase-functions";
import { databaseCollections } from "../../shared/enums/database-collections.enum";
import { authService } from "../auth/auth.service";

export const userUpdated = functions
  .region("europe-west1")
  .firestore.document(`${databaseCollections.USERS}/{userId}`)
  .onUpdate((change, context) => authService.updateFirebaseAuthUser(change, context));
export const userDeleted = functions
  .region("europe-west1")
  .firestore.document(`${databaseCollections.USERS}/{userId}`)
  .onDelete((snapshot, context) => authService.deleteFirebaseAuthUser(snapshot, context));
