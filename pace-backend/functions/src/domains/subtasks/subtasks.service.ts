import to from "await-to-js";
import { db } from "../../shared/database/admin";
import { databaseCollections } from "../../shared/enums/database-collections.enum";
import { firebaseHelper } from "../../shared/services/firebase-helper.service";
import { paceLoggingService } from "../../utils/services/logger";
import { projectService } from "../projects/projects.service";
import { User } from "../users/users.model";
import { userService } from "../users/users.service";
import { SubtaskMember, Subtask } from "./subtasks.model";
import { CreateSubtasktRequest } from "./subtasks.types";

class SubtasksService {
  private static instance: SubtasksService;

  /**
   * Emptt
   */
  constructor() {}

  /**
   * @return {SubtasksService}
   */
  public static getInstance(): SubtasksService {
    if (SubtasksService.instance) {
      return SubtasksService.instance;
    }
    return (SubtasksService.instance = new SubtasksService());
  }

  /**
   * Create subtask
   * @param {CreateSubtasktRequest.model} data
   * @param {string} userId
   */
  public async createSubtask(data: CreateSubtasktRequest, userId: string) {
    const { name, description, milestoneId, status, assignee } = data;
    paceLoggingService.log(`${SubtasksService.name}.${this.createSubtask.name} Creating subtask`, { data });

    const reporter = await this.generateSubtasksReporter(userId);
    if (!reporter) return { error: "Something went wrong. The subtasks reporter was not created" };

    const defaultSubtasksProps: Partial<Subtask> = {
      createdAt: Date.now(),
    };

    const subtask: Partial<Subtask> = {
      name,
      description: description ?? "",
      milestoneId,
      status,
      assignee: assignee ?? null,
      reporter,
      ...defaultSubtasksProps,
    };

    const subtaskSnapshot = await db.collection(databaseCollections.SUBTASKS).add(subtask);

    paceLoggingService.log(`${SubtasksService.name}.${this.createSubtask.name} New subtask successfully created`, {
      subtask: { uid: subtaskSnapshot.id, ...subtask },
    });

    return { uid: subtaskSnapshot.id, ...subtask };
  }

  /**
   * Update the subtask
   * @param {string} projectId
   * @param {Partial<Subtask>} data
   * @returns {boolean}
   */
  public async updateSubtask(subtaskId: string, data: Partial<Subtask> = {}) {
    paceLoggingService.log(`${SubtasksService.name}.${this.updateSubtask.name} Updating subtask ${subtaskId}`, data);
    if (!Object.keys(data).length) {
      paceLoggingService.error(`Update subtask request must be type Partial of Subtask`);
      return { error: "Update subtask request must be type Partial of Subtask" };
    }
    const [err] = await to(db.collection(databaseCollections.SUBTASKS).doc(subtaskId).update(data));

    if (err) {
      paceLoggingService.error(`Error while updating the subtask with id: ${subtaskId} -->`, err);
      return { error: err.message };
    }

    paceLoggingService.log(`${SubtasksService.name}.${this.updateSubtask.name} Finished update:`, {
      updateData: { subtaskId, ...data },
    });
    return { success: true };
  }

  /**
   * Generates subtask reporter from user id
   * @param userId
   * @returns
   */
  private async generateSubtasksReporter(userId: string): Promise<SubtaskMember | null> {
    const user = (await userService.findUserInFirestore(userId)) as User;

    if (!user) {
      paceLoggingService.log(
        `${SubtasksService.name}.${this.generateSubtasksReporter.name} User with id ${userId} not found`
      );
      return null;
    }
    return {
      name: user.name,
      photoUrl: user.photoUrl,
      avatarColor: user.avatarColor,
      uid: userId,
    };
  }

  /**
   * Delete subtask
   * @param {string} subtaskId
   */
  public async deleteSubtask(subtaskId: string) {
    paceLoggingService.log(`Attempting to delete subtask ${subtaskId}`);

    const [err, res] = await to(db.collection(databaseCollections.SUBTASKS).doc(subtaskId).delete());

    if (err) {
      paceLoggingService.error(`Error while deleting firebase subtask with id: ${subtaskId} -->`, {
        error: err.message,
      });
      return { error: err };
    }

    paceLoggingService.log(`${SubtasksService.name}.${this.deleteSubtask.name} Finished delete`, { subtaskId });
    return { res };
  }

  /**
   * Create batch and delete all subtasks from milestone
   * @param {string} milestoneId
   */
  public async deleteSubtasksForProject(milestoneId: string) {
    paceLoggingService.log(`Attempting to delete subtasks for milestone ${milestoneId}`);

    const subtasks = await db.collection(databaseCollections.SUBTASKS).where("milestoneId", "==", milestoneId).get();

    const batch = db.batch();
    subtasks.forEach((doc) => {
      paceLoggingService.log(`Deleting subtask from milestone in batch - ${doc.id}`);
      batch.delete(doc.ref);
    });
    await batch.commit();
  }

  /**
   * Update subtasks member after user update
   * @param {any}  change  User uid
   * @param {any}  context Updated data
   * @returnType {Promise} void
   */
  public async updateSubtasksMembers(change: any, context: any): Promise<void> {
    const after = change.after.data();
    const { photoUrl, name } = after;

    const userId = change.after.id;

    const dataToBeUpdated: Partial<SubtaskMember> = {};

    if (photoUrl) dataToBeUpdated.photoUrl = photoUrl;
    if (name) dataToBeUpdated.name = name;

    if (!Object.keys(dataToBeUpdated).length || !dataToBeUpdated) return;

    paceLoggingService.log("Attempting to update subtasks members (assignee/reporter) in milestone", {
      data: { userId, dataToBeUpdated },
    });

    const projects = await projectService.getProjectsForUser(userId);
    if (!projects) return paceLoggingService.log("No projects found. Stopping update");

    let milesstonesIds: string[] = [];
    projects.forEach((p) => (milesstonesIds = [...milesstonesIds, ...p.milestones]));
    let subtasks: Subtask[] = [];

    milesstonesIds.forEach(async (mId) => {
      subtasks.push(await this.getSubtasksForMilestone(mId));
    });

    subtasks.filter((s) => s.reporter.uid === userId || s.assignee?.uid === userId);
    if (!subtasks) return;
    subtasks.forEach((s) => {
      if (s.assignee && s.assignee.uid === userId) {
        return this.updateSubtask(s.uid, { assignee: { ...s.assignee, ...dataToBeUpdated } });
      }
      if (s.reporter.uid === userId) {
        return this.updateSubtask(s.uid, { reporter: { ...s.reporter, ...dataToBeUpdated } });
      }
      return;
    });
  }

  /**
   * Get subtasks for milestone
   * @param uid
   * @returns
   */
  public async getSubtasksForMilestone(milestoneId: string) {
    paceLoggingService.log(
      `${SubtasksService.name}.${this.getSubtasksForMilestone.name} Getting firestore subtasks for milestone`,
      {
        milestoneId,
      }
    );
    const subtasks = await db.collection(databaseCollections.SUBTASKS).where("milestoneId", "==", milestoneId).get();
    return firebaseHelper.docsToObjects(subtasks);
  }

  /**
   * Find subtask by uid in Firestore
   * @param {string} uid Subtask id
   * @return {Promise<Subtask>}
   */
  public async findSubtaskInFirebase(uid: string) {
    paceLoggingService.log(`${SubtasksService.name}.${this.findSubtaskInFirebase.name} Getting firestore subtask`, {
      uid,
    });
    const [err, doc] = await to(db.collection(databaseCollections.SUBTASKS).doc(uid).get());
    if (err) {
      paceLoggingService.error(JSON.stringify(err));
    }
    const subtask = doc?.data();
    return subtask ? ({ uid, ...subtask } as Subtask) : null;
  }
}

export const subtasksService = SubtasksService.getInstance();
