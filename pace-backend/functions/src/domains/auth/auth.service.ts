import * as _ from "lodash";
import { db, fbAdmin } from "../../shared/database/admin";
import { userService } from "../users/users.service";
import { databaseCollections } from "../../shared/enums/database-collections.enum";
import { User } from "../users/users.model";

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

    return { ...user, uid } as User;
  }

  /**
   * Create custom auth token
   * @param {string}  id Firebase user uid
   * @param {object}  object additionalClaims
   * @returnType {Promise} Promise with custom token
   */
  public async createCustomToken(id: string, object?: any) {
    return await fbAdmin.auth().createCustomToken(id, object);
  }
}

export const authService = AuthService.getInstance();
