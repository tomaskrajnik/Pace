import to from "await-to-js";
import { db } from "../../shared/database/admin";
import { databaseCollections } from "../../shared/enums/database-collections.enum";
import { firebaseHelper } from "../../shared/services/firebase-helper.service";
import { paceLoggingService } from "../../utils/services/logger";
import { projectService } from "../projects/projects.service";
import { Milestone } from "./milestones.model";
import { CreateMilestoneRequest } from "./milestones.types";

class MilestonesSerice {
  private static instance: MilestonesSerice;
  /**
   * Empty
   */
  private constructor() {}

  /**
   * @return {MilestonesSerice}
   */
  public static getInstance(): MilestonesSerice {
    if (MilestonesSerice.instance) {
      return MilestonesSerice.instance;
    }
    return (MilestonesSerice.instance = new MilestonesSerice());
  }

  /**
   * Create milestone
   * @param {string} name
   * @param {string} projectId
   * @param {string} description
   * @param {string} color
   * @param {number} startDate
   * @param {number} endDate
   */
  public async createMilestone(data: CreateMilestoneRequest) {
    const { name, projectId, description, color, startDate, endDate } = data;
    paceLoggingService.log(`${MilestonesSerice.name}.${this.createMilestone.name} Creating milestone`, { data });

    const defaultMilestoneProps: Partial<Milestone> = {
      createdAt: Date.now(),
    };

    if (startDate > endDate) {
      return { error: "Start date must be sooner than end date." };
    }

    const milestone: Partial<Milestone> = {
      name,
      projectId,
      description,
      color,
      startDate,
      endDate,
      ...defaultMilestoneProps,
    };

    const milestoneSnapshot = await db.collection(databaseCollections.MILESTONES).add(milestone);
    paceLoggingService.log(
      `${MilestonesSerice.name}.${this.createMilestone.name}  New milestone successfully created`,
      {
        project: {
          uid: milestoneSnapshot.id,
          ...milestone,
        },
      }
    );
    return { uid: milestoneSnapshot.id, ...milestone };
  }

  /**
   * Delete milestone
   * @param {string} milestoneId
   * @returns {Promise<boolean>}
   */
  public async deleteMilestone(milestoneId: string) {
    paceLoggingService.log(`Attempting to delete milestone ${milestoneId}`);

    const [err, res] = await to(db.collection(databaseCollections.MILESTONES).doc(milestoneId).delete());

    if (err) {
      paceLoggingService.error(`Error while deleting firebase milestone with id: ${milestoneId} -->`, {
        error: err.message,
      });
      return { error: err };
    }

    paceLoggingService.log(`${MilestonesSerice.name}.${this.deleteMilestone.name} Finished delete`, { milestoneId });
    return { res };
  }

  /**
   * Create batch and delete all milestones from project
   * @param {string} projectId
   */
  public async deleteMilestonesFromProject(projectId: string) {
    paceLoggingService.log(`Attempting to delete milestones for project ${projectId}`);

    const subtasks = await db.collection(databaseCollections.MILESTONES).where("projectId", "==", projectId).get();

    const batch = db.batch();
    subtasks.forEach((doc) => {
      paceLoggingService.log(`Deleting milestone from project in batch - ${doc.id}`);
      batch.delete(doc.ref);
    });
    await batch.commit();
  }

  /**
   * Get milestones for project
   * @param {string} projectId
   */
  public async getMilestonesForProject(projectId: string) {
    paceLoggingService.log(`Getting milestones for project ${projectId}`);

    const { docs } = await db.collection(databaseCollections.MILESTONES).where("projectId", "==", projectId).get();
    const milestones = firebaseHelper.docsToObjects(docs) as Milestone[];

    return milestones ?? [];
  }

  /**
   * Update the milestone
   * @param {string} milestoneId
   * @param {Patial<Milestone>} data
   * @returns {boolean}
   */
  public async updateMilestone(milestoneId: string, data: Partial<Milestone> = {}) {
    paceLoggingService.log(
      `${MilestonesSerice.name}.${this.updateMilestone.name} Updating milestone ${milestoneId}`,
      data
    );
    if (!Object.keys(data).length) {
      paceLoggingService.error(`Update milestone request must be type Milestone of Milestone`);
      return { error: "Update milestone request must be type Milestone of Milestone" };
    }
    const [err] = await to(db.collection(databaseCollections.MILESTONES).doc(milestoneId).update(data));

    if (err) {
      paceLoggingService.error(`Error while updating the project with id: ${milestoneId} -->`, err);
      return { error: err.message };
    }

    paceLoggingService.log(`${MilestonesSerice.name}.${this.updateMilestone.name} Finished update:`, {
      updateData: { milesoneService, ...data },
    });
    return { success: true };
  }

  /**
   * Get milestone and validate user permissions
   * @param {string} userId
   * @param {string} milestoneId
   * @returns
   */
  public async getMilestoneAndValidatePermission(userId: string, milestoneId: string) {
    const milestone = await this.findMilestoneInFirebase(milestoneId);
    if (!milestone) return { error: "No milestone with corresponding id found" };
    return projectService.getProjectAndValidatePermissions(userId, milestone.projectId);
  }

  /**
   * Find milestone by uid in Firestore
   * @param {string} uid Milestone id
   * @return {Promise<Milestone>}
   */
  public async findMilestoneInFirebase(uid: string) {
    paceLoggingService.log(
      `${MilestonesSerice.name}.${this.findMilestoneInFirebase.name} Getting firestore milestone`,
      {
        uid,
      }
    );
    const [err, doc] = await to(db.collection(databaseCollections.MILESTONES).doc(uid).get());
    if (err) {
      paceLoggingService.error(JSON.stringify(err));
    }
    const milestone = doc?.data();
    return milestone ? ({ uid, ...milestone } as Milestone) : null;
  }
}

export const milesoneService = MilestonesSerice.getInstance();
