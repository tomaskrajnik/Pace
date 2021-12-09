import to from "await-to-js";
import { db } from "../../shared/database/admin";
import { databaseCollections } from "../../shared/enums/database-collections.enum";
import { firebaseHelper } from "../../shared/services/firebase-helper.service";
import { paceLoggingService } from "../../utils/services/logger";
import { Project, ProjectMemberRole } from "../projects/projects.model";
import { projectService } from "../projects/projects.service";
import { User } from "../users/users.model";
import { userService } from "../users/users.service";
import { Invitation } from "./invitations.model";

class InvitationService {
  private static instance: InvitationService;
  /**
   * Empty
   */
  private constructor() {}

  /**
   * @return {InvitationService}
   */
  public static getInstance(): InvitationService {
    if (InvitationService.instance) {
      return InvitationService.instance;
    }
    return (InvitationService.instance = new InvitationService());
  }

  /**
   * Create invitation
   * @param {string} projectId
   * @param {string} email
   * @param {string} role enum "owner" | "viewer" | "editor"
   * @param {string} projectName
   * @param {string} invitedBy email
   */
  public async createInvitation(
    projectId: string,
    email: string,
    role: ProjectMemberRole,
    projectName: string,
    invitedBy: string
  ) {
    paceLoggingService.log(`${InvitationService.name}.${this.createInvitation.name}, Creating new invitation:,`, {
      data: { projectId, email, role, projectName, invitedBy },
    });

    const userInvitations = await this.getInvitationsForUser(email);
    const invitationExists = userInvitations.some((i) => i.projectId === projectId && i.accepted === false);
    if (invitationExists) return { error: "User already invited" };

    const project = await projectService.findProjectInFirestore(projectId);
    if (!project) return { error: "Somehting went wrong" };

    for (const m of project.members) {
      const member = await userService.findUserInFirebase(m.uid);
      if (member?.email === email) {
        return { error: `User with email: ${email} is already part of this project` };
      }
    }

    const invitation: Omit<Invitation, "uid"> = {
      projectId,
      email,
      role,
      projectName,
      invitedBy,
      createdAt: Date.now(),
      accepted: false,
    };
    const invitationSnapshot = await db.collection(databaseCollections.INVITATIONS).add(invitation);
    paceLoggingService.log(
      `${InvitationService.name}.${this.createInvitation.name}  New invitation successfully created`,
      {
        invitation: {
          uid: invitationSnapshot.id,
          ...invitation,
        },
      }
    );
    return { uid: invitationSnapshot.id, ...invitation };
  }

  /**
   * Accept invitation and create projet member
   * @param {string} userId
   * @param {string} invitationId
   */
  public async acceptInvitation(userId: string, invitationId: string) {
    paceLoggingService.log(`${InvitationService.name}.${this.acceptInvitation.name}, Accepting invitation:,`, {
      data: { userId, invitationId },
    });

    const user = (await userService.findUserInFirestore(userId)) as User;
    if (!user) return { error: "User not found" };

    const invitations = await invitationService.getInvitationsForUser(user.email);
    const invitation = invitations.filter((i) => i.uid === invitationId)[0];
    if (!invitation) {
      paceLoggingService.error("No invitation found for user.", { userId });
      return { error: "No invitation found" };
    }

    await this.updateInvitation(invitationId, { accepted: true });
    await userService.updateUserData(userId, { projects: [...user.projects, invitation.projectId] });
    return await projectService.addInvitedMemberToProject(
      invitation.projectId,
      userId,
      invitation.role,
      invitation.uid
    );
  }

  /**
   * Decline and remove invitation
   * @param {string} userId
   * @param {string} invitationId
   */
  public async declineInvitation(userId: string, invitationId: string) {
    paceLoggingService.log(`${InvitationService.name}.${this.declineInvitation.name}, Declining invitation:,`, {
      data: { userId, invitationId },
    });

    const user = (await userService.findUserInFirestore(userId)) as User;
    if (!user) return { error: "User not found" };

    const invitations = await invitationService.getInvitationsForUser(user.email);
    const invitation = invitations.filter((i) => i.uid === invitationId)[0];
    if (!invitation) {
      paceLoggingService.error("No invitation found for user.", { userId });
      return { error: "No invitation found" };
    }

    const project = (await projectService.findProjectInFirestore(invitation.projectId)) as Project;
    if (!project) {
      paceLoggingService.error("No project found for invitation.", { invitationId });
      return { error: "No project found" };
    }
    const updatedInvitations = project.invitations.filter((p) => p !== invitationId);

    await projectService.updateProject(project.uid, { invitations: updatedInvitations });
    return await this.deleteInvitation(invitationId);
  }

  /**
   * Update the invitation
   * @param invitationId
   * @param data
   * @returns {boolean}
   */
  public async updateInvitation(invitationId: string, data: Partial<Invitation> = {}) {
    paceLoggingService.log(
      `${InvitationService.name}.${this.updateInvitation.name} Updating invitation ${invitationId}`,
      data
    );
    if (!Object.keys(data).length) {
      paceLoggingService.error(`Update invitation request must be type Partial of Invitation`);
      return { error: "Update invitationn request must be type Partial of Invitation" };
    }
    const [err] = await to(db.collection(databaseCollections.INVITATIONS).doc(invitationId).update(data));

    if (err) {
      paceLoggingService.error(`Error while updating the project with id: ${invitationId} -->`, err);
      return { error: err.message };
    }

    paceLoggingService.log(`${InvitationService.name}.${this.updateInvitation.name} Finished update:`, {
      updateData: { invitationId, ...data },
    });
    return { success: true };
  }

  /**
   * Delete invitation
   * @param {string} invitationId
   */
  public async deleteInvitation(invitationId: string) {
    paceLoggingService.log(`Attempting to delete innvitation ${invitationId}`);

    const [err, res] = await to(db.collection(databaseCollections.INVITATIONS).doc(invitationId).delete());

    if (err) {
      paceLoggingService.error(`Error while deleting firebase invitation with id: ${invitationId} -->`, {
        error: err.message,
      });
      return { error: err };
    }

    paceLoggingService.log(`${InvitationService.name}.${this.deleteInvitation.name} Finished delete`, {
      invitationId,
    });
    return { res };
  }

  /**
   * Get invitations for user
   * @param {string} email
   * @returns {Invitation}
   */
  public async getInvitationsForUser(email: string) {
    const snapshot = await db.collection(databaseCollections.INVITATIONS).where("email", "==", email).get();
    return firebaseHelper.docsToObjects(snapshot.docs) as Invitation[];
  }

  /**
   * Check if user is member of the project
   * @param userId
   * @param invitationId
   * @returns
   */
  public async userCanDeleteInvitation(userId: string, invitationId: string) {
    const invitation = await this.findInvitationInFirebase(invitationId);
    if (!invitation) return { error: "No invitation found" };
    const project = await projectService.findProjectInFirestore(invitation.projectId);
    if (!project) return { error: "No project found" };

    return project.members.some((m) => m.uid === userId && m.role !== ProjectMemberRole.VIEWER);
  }

  /**
   * Find invitation by uid
   * @param {string} uid invitation id
   * @return {Promise<Invitation[]>}
   */
  public async findInvitationInFirebase(uid: string) {
    paceLoggingService.log(
      `${InvitationService.name}.${this.findInvitationInFirebase.name} Getting firestore inivtation`,
      {
        uid,
      }
    );
    const [err, doc] = await to(db.collection(databaseCollections.INVITATIONS).doc(uid).get());
    if (err) {
      paceLoggingService.error(JSON.stringify(err));
    }
    const invitation = doc?.data();
    return invitation ? ({ uid, ...invitation } as Invitation) : null;
  }
}

export const invitationService = InvitationService.getInstance();
