import * as _ from "lodash";
import { fbAdmin } from "../../shared/database/admin";
import { userService } from "../users/users.service";
import { paceLoggingService } from "../../utils/services/logger";

class AuthService {
  private static instance: AuthService;

  /**
   * @return {AuthService}
   */
  public static getInstance(): AuthService {
    if (AuthService.instance) {
      return AuthService.instance;
    }
    return (AuthService.instance = new AuthService());
  }

  /**
   * Classic email-password sign up
   * @param {string}  firstName
   * @param {string}  lastName
   * @param {string}  email
   * @param {string}  password
   * @returnType {Promise}
   */
  public async signup(data: SignUpRequest) {
    paceLoggingService.log(`${AuthService.name}.${this.signup.name} Signing up user ${data}`);
    const { uid } = data;
    const firebaseUser = await userService.findUserInFirebase(uid);
    if (!firebaseUser) {
      return { error: "Can't create new pace user without valid google auth UID" };
    }

    const isPaceUser = await userService.findUserInFirestore(uid);
    if (isPaceUser) {
      // TODO delete user from firebase Auth
      return { error: "User already registered" };
    }

    const user = await userService.createPaceUser(data);

    return { user };
  }

  /**
   * Generate password reset link
   * @param {string}  email Firebase user uid
   * @returnType {Promise} Promise returnning link
   */
  public async generatePasswordResetLink(email: string): Promise<string> {
    paceLoggingService.log(`${AuthService.name}.${this.generatePasswordResetLink.name} Updating user ${email}`);
    return fbAdmin.auth().generatePasswordResetLink(email);
  }

  /**
   * Update firebase auth user data
   * @param {any}  change Firebase user uid
   * @param {any}  context Updated data
   * @returnType {Promise} void
   */
  public async updateFirebaseAuthUser(change: any, context: any): Promise<void> {
    const after = change.after.data();
    paceLoggingService.log(
      `${AuthService.name}.${this.updateFirebaseAuthUser.name} Updating firebase user ${change.after.id}`
    );
    const { photoUrl, name, email, phoneNumber } = after;
    const dataToBeUpdated = {
      ...(photoUrl ?? null),
      ...(name ?? null),
      ...(email ?? null),
      ...(phoneNumber ?? null),
    };
    if (!Object.keys(dataToBeUpdated).length) {
      return paceLoggingService.log(`No changes found. Stopping the function`);
    }
    await fbAdmin.auth().updateUser(change.after.id, dataToBeUpdated);
  }

  /**
   * Create custom auth token
   * @param {string}  id Firebase user uid
   * @param {object}  object additionalClaims
   * @returnType {Promise} Promise with custom token
   */
  public async createCustomToken(id: string, object?: any): Promise<string> {
    paceLoggingService.log(`${AuthService.name}.${this.createCustomToken.name} Creating custom token for a user ${id}`);
    return await fbAdmin.auth().createCustomToken(id, object);
  }

  /**
   * Delete firebase auth user
   * @param {any}  snapshot Firebase user uid
   * @param {context}  context additionalClaims
   * @returnType {Promise} Promise with custom token
   */
  public async deleteFirebaseAuthUser(snapshot: any, context: any): Promise<void> {
    const uid = snapshot.id;
    paceLoggingService.log(
      `${AuthService.name}.${this.deleteFirebaseAuthUser.name} Deleting firebase auth user ${uid}`
    );

    await fbAdmin.auth().deleteUser(uid);
  }
}

export const authService = AuthService.getInstance();
