import { db, fbAdmin } from "./../../shared/database/admin";
import { to } from "await-to-js";
import { databaseCollections } from "../../shared/enums/database-collections.enum";
import { User } from "./users.model";
import { paceLoggingService } from "../../utils/services/logger";
import { Project, ProjectMemberRole } from "../projects/projects.model";
import { projectService } from "../projects/projects.service";
import { generatePastelColor } from "../../utils/colors";

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
      phoneNumber: "",
      projects: [],
      avatarColor: generatePastelColor(),
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
    paceLoggingService.log(`${UserService.name}.${this.updateUserData.name} Updating user ${userId}`, data);
    if (!Object.keys(data).length) {
      paceLoggingService.error(`Update user request must be type Partial of User`);
      return { error: "Update user request must be type Partial of User" };
    }
    const [err] = await to(db.collection(databaseCollections.USERS).doc(userId).update(data));

    if (err) {
      paceLoggingService.error(`Error while updating firebase user with id: ${userId} -->`, err);
      return { error: err.message };
    }

    paceLoggingService.log(`${UserService.name}.${this.updateUserData.name} Finished update:`, {
      updateData: { userId, ...data },
    });
    return { success: true };
  }

  /**
   * Delete user
   * @param {string} id user id
   * @returns {object} firebase response
   */
  public async deleteUser(id: string) {
    paceLoggingService.log(`${UserService.name}.${this.updateUserData.name} Deleting user ${id}`);
    const userDoc = (await this.findUserInFirestore(id)) as Omit<User, "uid">;

    // FInd all projects where the user is owner annd delete them
    const { projects } = userDoc;

    for (const p of projects) {
      const project = (await projectService.findProjectInFirestore(p)) as Project;
      // If the user is the only member
      if (project.members.length === 1 && project.members[0].uid === id) {
        await projectService.deleteProject(project.uid);
        break;
      }

      // If the user is the owner of the project
      const ownnedProject = project.members.map((m) => m.uid === id && m.role === ProjectMemberRole.OWNER);
      if (!ownnedProject) break;

      await projectService.deleteProject(p);
    }

    const [err, res] = await to(db.collection(databaseCollections.USERS).doc(id).delete());
    if (err) {
      paceLoggingService.error(`Error while deleting firebase user with id: ${id} -->`, err);
      return { error: err };
    }

    paceLoggingService.log(`${UserService.name}.${this.updateUserData.name} Pace user deleted:`, { userId: id });
    return { res };
  }

  /**
   * Automatically add project to user model after creating one
   * @param {snapshot}
   * @param {context}
   */
  public async addInitialProjectToUser(snapshot: any, context: any): Promise<void> {
    const projectId = snapshot.id;
    const data: Project = snapshot.data();
    const userId = data.members[0].uid;
    paceLoggingService.log(
      `${UserService.name}.${this.addInitialProjectToUser.name}, Adding project to user trigger:,`,
      { ids: { userId, projectId } }
    );
    await this.addProjectToUser(userId, projectId);
  }

  /**
   * Add project to the user
   * @param {string} userId
   * @param {string} projectId
   */
  public async addProjectToUser(userId: string, projectId: string) {
    const user = (await this.findUserInFirestore(userId)) as Omit<User, "uid">;
    const { projects } = user;
    const updatedProjects = [...projects, projectId];
    await this.updateUserData(userId, { projects: updatedProjects });
  }

  /**
   * Remove project from the user
   * @param {string} userId
   * @param {string} projectId
   */
  public async removeProjectFromUser(userId: string, projectId: string) {
    paceLoggingService.log("Attempting to delete project from the user model", { data: { userId, projectId } });
    const user = (await this.findUserInFirestore(userId)) as Omit<User, "uid">;

    const { projects } = user;
    let updatedProjects: string[] = [];

    projects.forEach((p) => p !== projectId && updatedProjects.push(p));
    await this.updateUserData(userId, { projects: updatedProjects });
  }

  /**
   * Find user by uid in Firestore
   * @param {string} uid User id
   * @return {Promise<admin.auth.UserRecord>}
   */
  public async findUserInFirestore(uid: string) {
    paceLoggingService.log(`${UserService.name}.${this.findUserInFirestore.name}, Getting firestore user:,`, { uid });
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
