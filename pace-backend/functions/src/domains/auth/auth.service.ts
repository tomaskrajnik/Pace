import * as _ from "lodash";
import { db, fbAdmin } from "../../shared/database/admin";
import { userService } from "../users/users.service";
import { databaseCollections } from "../../shared/enums/database-collections.enum";
import { User } from "../users/users.model";
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
      // todo delete user from firebase Auth
      return { error: "User already registered" };
    }

    const user = await this.createPaceUser(data);

    return { user };
  }

  /**
   * Create Zlozka user
   * @param {string}  firstName
   * @param {string}  lastName
   * @param {string}  email
   * @param {string}  password
   * @returnType {Promise}
   */
  public async createPaceUser(data: SignUpRequest): Promise<User> {
    const { uid, email, name, jobTitle, companyName, photoUrl } = data;

    const defaultUserProps: Partial<User> = {
      createdAt: Date.now(),
      emailVerified: false,
      photoUrl: photoUrl ?? "",
      jobTitle: jobTitle ?? "",
      companyName: companyName ?? "",
    };

    const user = { email, name, ...defaultUserProps };
    await db.collection(databaseCollections.USERS).doc(uid).set(user);

    paceLoggingService.log(`${AuthService.name}.${this.createPaceUser.name} Creating pace user ${{ uid, ...user }}`);
    return { ...user, uid } as User;
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
      `${AuthService.name}.${this.updateFirebaseAuthUser.name} Updating firebase user ${after.change.id}`
    );

    const { photoUrl, name, email, phoneNumber } = after;
    await fbAdmin.auth().updateUser(change.after.id, { photoURL: photoUrl, phoneNumber, displayName: name, email });
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
