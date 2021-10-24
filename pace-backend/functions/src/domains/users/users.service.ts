import { db, fbAdmin } from "./../../shared/database/admin";
import { to } from "await-to-js";
import { databaseCollections } from "../../shared/enums/database-collections.enum";
import { User } from "./users.model";
import { paceLoggingService } from "../../utils/services/logger";

class UserService {
  private static instance: UserService;
  /**
   * Empty
   */
  private constructor() {}

  /**
   * @return {UserService}
   */
  public static getInstance(): UserService {
    if (UserService.instance) {
      return UserService.instance;
    }
    return (UserService.instance = new UserService());
  }

  /**
   * Create Pace user
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

    paceLoggingService.log(`${UserService.name}.${this.createPaceUser.name} Creating pace user ${{ uid, ...user }}`);
    return { ...user, uid } as User;
  }

  /**
   * Update Pace user information
   * @param {string} userId
   * @param {object} data
   * @returns {object} firebase response
   */
  public async updateUserData(userId: string, data: Partial<User> = {}) {
    paceLoggingService.log(`${UserService.name}.${this.updateUserData.name} Updating user ${userId}`, { data });
    const [err] = await to(
      db
        .collection(databaseCollections.USERS)
        .doc(userId)
        .update({ ...data })
    );

    if (err) {
      paceLoggingService.error(`Error while updating firebase user with id: ${userId} -->`, err);
      return { error: err };
    }

    paceLoggingService.log(`${UserService.name}.${this.updateUserData.name} Finished update:`, { userId, ...data });
    return { data: "Update successful" };
  }

  /**
   * Delete user
   * @param {string} id user id
   * @returns {object} firebase response
   */
  public async deleteUser(id: string) {
    paceLoggingService.log(`${UserService.name}.${this.updateUserData.name} Deleting user ${id}`);
    const [err, res] = await to(db.collection(databaseCollections.USERS).doc(id).delete());

    if (err) {
      paceLoggingService.error(`Error while deleting firebase user with id: ${id} -->`, err);
      return { error: err };
    }

    paceLoggingService.log(`${UserService.name}.${this.updateUserData.name} Finished update:`, { userId: id });
    return { res };
  }

  /**
   * Find user by uid in Firestore
   * @param {string} uid User id
   * @return {Promise<admin.auth.UserRecord>}
   */
  public async findUserInFirestore(uid: string) {
    paceLoggingService.log(`${UserService.name}.${this.findUserInFirestore} Getting firestore user:,`, { uid });
    const [err, doc] = await to(db.collection(databaseCollections.USERS).doc(uid).get());
    if (err) {
      paceLoggingService.error(JSON.stringify(err));
    }
    const user = doc?.data();
    return user ? user : null;
  }

  /**
   * Find user by uid in Firebase auth
   * @param {string} uid User id
   * @return {Promise<admin.auth.UserRecord>}
   */
  public async findUserInFirebase(uid: string) {
    const [err, user] = await to(fbAdmin.auth().getUser(uid));
    if (err) {
      paceLoggingService.error(JSON.stringify(err));
    }
    return user ? user : null;
  }

  /**
   * Find user by email in Firebase auth
   * @param {string} uid User id
   * @return {Promise<admin.auth.UserRecord>}
   */
  public async findUserInFirebaseByEmail(email: string) {
    const [err, user] = await to(fbAdmin.auth().getUserByEmail(email));
    if (err) {
      paceLoggingService.error(JSON.stringify(err));
    }
    return user ? user : null;
  }
}

export const userService = UserService.getInstance();
