import to from "await-to-js";
import { firestore } from "firebase-admin";
import { db } from "../../shared/database/admin";
import { databaseCollections } from "../../shared/enums/database-collections.enum";
import { firebaseHelper } from "../../shared/services/firebase-helper.service";
import { paceLoggingService } from "../../utils/services/logger";
import { Invitation } from "../invitations/invitations.model";
import { Milestone } from "../milestones/milestones.model";
import { milesoneService } from "../milestones/milestones.service";
import { subtasksService } from "../subtasks/subtasks.service";
import { User } from "../users/users.model";
import { userService } from "../users/users.service";
import { Project, ProjectMember, ProjectMemberRole } from "./projects.model";
import { CreateProjectRequest } from "./projects.types";

class ProjectService {
  private static instance: ProjectService;
  /**
   * Empty
   */
  private constructor() {}

  /**
   * @return {ProjectService}
   */
  public static getInstance(): ProjectService {
    if (ProjectService.instance) {
      return ProjectService.instance;
    }
    return (ProjectService.instance = new ProjectService());
  }

  /**
   * Create project
   * @param {string} name
   * @param {string} photoUrl
   */
  public async createProject(data: CreateProjectRequest) {
    const { name, photoUrl, userId } = data;
    paceLoggingService.log(`${ProjectService.name}.${this.createProject.name} Creating project`, { name, userId });
    const initialMember = await this.generateProjectMember(userId, ProjectMemberRole.OWNER);

    if (!initialMember) {
      paceLoggingService.error(
        `${ProjectService.name}.${this.createProject.name} Error while creating project initial member - `,
        { name, userId }
      );
      return { error: "Error while creating project" };
    }

    const defaultProjectProps: Partial<Project> = {
      createdAt: Date.now(),
      milestones: [],
      invitations: [],
    };

    const project: Partial<Project> = { name, photoUrl, members: [initialMember], ...defaultProjectProps };
    const projectSnapshot = await db.collection(databaseCollections.PROJECTS).add(project);
    paceLoggingService.log(`${ProjectService.name}.${this.createProject.name}  New project successfully created`, {
      project: {
        uid: projectSnapshot.id,
        ...project,
      },
    });
    return { uid: projectSnapshot.id, ...project };
  }

  /**
   * Delete project
   * @param {string} projectId
   */
  public async deleteProject(projectId: string) {
    paceLoggingService.log(`Attempting to delete project ${projectId}`);

    const [err, res] = await to(db.collection(databaseCollections.PROJECTS).doc(projectId).delete());

    if (err) {
      paceLoggingService.error(`Error while deleting firebase project with id: ${projectId} -->`, {
        error: err.message,
      });
      return { error: err };
    }

    paceLoggingService.log(`${ProjectService.name}.${this.deleteProject.name} Finished delete`, { projectId });
    return { res };
  }

  /**
   * Find project by uid in Firestore
   * @param {string} uid Project id
   * @return {Promise<Project>}
   */
  public async findProjectInFirestore(uid: string) {
    paceLoggingService.log(`${ProjectService.name}.${this.findProjectInFirestore.name} Getting firestore project`, {
      uid,
    });
    const [err, doc] = await to(db.collection(databaseCollections.PROJECTS).doc(uid).get());
    if (err) {
      paceLoggingService.error(JSON.stringify(err));
    }
    const project = doc?.data();
    return project ? ({ uid, ...project } as Project) : null;
  }

  /**
   * Return if user has permission to manipulate with object
   * @param {string} userId
   * @param {Project} project
   * @returns {boolean} hasPermission
   */
  public async userHasPermissionToManipulateProject(userId: string, project: Project) {
    paceLoggingService.log(
      `${ProjectService.name}.${this.userHasPermissionToManipulateProject.name}, Checking user permission for project:,`,
      {
        data: { userId, project },
      }
    );
    const user = (await userService.findUserInFirestore(userId)) as Partial<User>;
    if (!user) return false;
    return project.members.some((m) => m.uid === userId && m.role !== ProjectMemberRole.VIEWER);
  }

  /**
   * Update the project
   * @param {string} projectId
   * @param {Partial<Project>} data
   * @returns {boolean}
   */
  public async updateProject(projectId: string, data: Partial<Project> = {}) {
    paceLoggingService.log(`${ProjectService.name}.${this.updateProject.name} Updating project ${projectId}`, data);
    if (!Object.keys(data).length) {
      paceLoggingService.error(`Update project request must be type Partial of Project`);
      return { error: "Update project request must be type Partial of Project" };
    }
    const [err] = await to(db.collection(databaseCollections.PROJECTS).doc(projectId).update(data));

    if (err) {
      paceLoggingService.error(`Error while updating the project with id: ${projectId} -->`, err);
      return { error: err.message };
    }

    paceLoggingService.log(`${ProjectService.name}.${this.updateProject.name} Finished update:`, {
      updateData: { projectId, ...data },
    });
    return { success: true };
  }

  /**
   * Validate if user has permission to manipulate with project
   * @param {string} userId
   * @param {string} projectId
   */
  async getProjectAndValidatePermissions(userId: string, projectId: string) {
    if (!projectId) {
      paceLoggingService.error("Validate user has project permission - Project id not provided");
      return { error: "Project id not provided" };
    }

    const project = await projectService.findProjectInFirestore(projectId);

    if (!project) {
      paceLoggingService.error("Validate user has project permission - project with the id does not exist", {
        projectId,
      });
      return { error: "Project with provided id does not exist" };
    }
    const userHasPermission = await this.userHasPermissionToManipulateProject(userId, project);
    if (!userHasPermission) {
      paceLoggingService.error("Validate user has project permission - user does not have permission", {
        data: { userId, project },
      });
      return {
        error: "Unautorized",
      };
    }
    return { project };
  }

  /**
   * Update invitations in project after inviting project memer
   * @param snapshot
   * @param context
   */
  async updateInvitations(snapshot: any, context: any) {
    const invitationId = snapshot.id;
    const data: Omit<Invitation, "uid"> = snapshot.data();
    const project = await this.findProjectInFirestore(data.projectId);
    if (!project) {
      return paceLoggingService.error("Project not found while updating invitations", { invitationId });
    }
    let invitations: string[] = [];
    if (project.invitations.includes(invitationId)) {
      paceLoggingService.log("Removing invitaion from project", { project: project.uid, invitationId });
      invitations = project.invitations.filter((i) => i !== invitationId);
    } else {
      paceLoggingService.log("Adding invitaion to project", { project: project.uid, invitationId });
      invitations = [...project.invitations, invitationId];
    }

    return await this.updateProject(project.uid, { invitations });
  }

  /**
   * Add user to project after accepting invitation
   * @param {string} projectId
   * @param {string} userId
   * @param {string} role
   * @param {string} invitationId
   */
  public async addInvitedMemberToProject(
    projectId: string,
    userId: string,
    role: ProjectMemberRole,
    invitationId: string
  ) {
    paceLoggingService.log("Adding new project member", { data: { projectId, userId, role, invitationId } });
    const member = await this.generateProjectMember(userId, role);
    const project = (await this.findProjectInFirestore(projectId)) as Project;
    const invitations = project.invitations.filter((i) => i !== invitationId);
    const members = [...project.members, member];

    return await this.updateProject(projectId, { members, invitations });
  }

  /**
   * Update project member after user update
   * @param {any}  change  User uid
   * @param {any}  context Updated data
   * @returnType {Promise} void
   */
  public async updateProjectMemberDataOnuserUpdate(change: any, context: any): Promise<void> {
    const after = change.after.data();
    const { photoUrl, name } = after;

    const userId = change.after.id;

    const dataToBeUpdated: Partial<ProjectMember> = {};

    if (photoUrl) dataToBeUpdated.photoUrl = photoUrl;
    if (name) dataToBeUpdated.name = name;

    if (!Object.keys(dataToBeUpdated).length) return;

    paceLoggingService.log("Attempting to update project members in user projects", {
      data: { userId, dataToBeUpdated },
    });

    const projects = await this.getProjectsForUser(userId);
    if (!projects) return paceLoggingService.log("No projects found. Stopping update");

    projects.forEach(async (p) => {
      const newMembers = [...p.members];
      const idx = newMembers.findIndex((pm) => pm.uid === userId);
      newMembers[idx] = { ...newMembers[idx], ...dataToBeUpdated };
      await this.updateProject(p.uid, { members: newMembers });
    });
  }

  /**
   * Leave project
   * @param {stting} userId
   * @param {string} projectId
   */
  public async leaveProject(userId: string, projectId: string) {
    paceLoggingService.log("User trying to leave project", { data: { projectId, userId } });
    const project = (await this.findProjectInFirestore(projectId)) as Project;

    if (!project) {
      paceLoggingService.error("Error while leaving project - no corresponding project found");
      return { error: "Project not found" };
    }

    const member = project.members.filter((p) => p.uid === userId)[0];
    if (!member) {
      paceLoggingService.error("Error while leaving project - no corresponding member found");
      return { error: "User is not a member of requested project" };
    }

    if (member.role === ProjectMemberRole.OWNER) {
      const projectOwners = project.members.filter((m) => m.role === ProjectMemberRole.OWNER);
      if (projectOwners.length === 1) {
        // Delete project if single owner removes it
        return await this.deleteProject(projectId);
      }
    }

    // Unassign user from subtasks
    const assignedSubtasks = await subtasksService.getAllAssignedSubtasksForProject(projectId, userId);
    if (assignedSubtasks.length) {
      for (const a of assignedSubtasks) {
        await subtasksService.updateSubtask(a.uid, { assignee: null });
      }
    }

    const updatedMembers = project.members.filter((m) => m.uid !== userId);
    await this.updateProject(projectId, { members: updatedMembers });

    const user = (await userService.findUserInFirestore(userId)) as User;
    const userProjects = user.projects.filter((p) => p !== projectId);
    await userService.updateUserData(userId, { projects: userProjects });

    paceLoggingService.log("User successfully removed from the project", { data: { projectId, userId } });
    return { success: true };
  }

  /**
   * Get all projects for user
   * @param userId
   * @returns
   */
  public async getProjectsForUser(userId: string): Promise<Project[] | null> {
    paceLoggingService.log(`${ProjectService.name}.${this.getProjectsForUser.name} Getting projects for user`, {
      userId,
    });
    const user = (await userService.findUserInFirestore(userId)) as User;

    if (user.projects.length === 0) {
      paceLoggingService.log(`No projects found for user ${userId}. Stopping update`);
      return null;
    }

    const snapshot = await db
      .collection(databaseCollections.PROJECTS)
      .where(firestore.FieldPath.documentId(), "in", user.projects)
      .get();
    paceLoggingService.log("Docs", { snapshot });
    const projects = firebaseHelper.docsToObjects(snapshot.docs);

    return projects ? projects : null;
  }

  /**
   * Remove all traces after deleting project
   * @param {snapshot}
   * @param {context}
   */
  public async removeAllTracesAfterDelete(snapshot: any, context: any): Promise<void> {
    const projectId = snapshot.id;
    const data: Project = snapshot.data();
    const promises: Promise<void>[] = [];
    data.members.forEach((m) => {
      promises.push(userService.removeProjectFromUser(m.uid, projectId));
    });

    promises.push(milesoneService.deleteMilestonesFromProject(projectId));

    await Promise.all(promises);
  }

  /**
   * Automatically updates milestones in project on milestone create or delete
   * @param userId
   * @param role
   * @returns
   */
  public async updateMilestonesInProject(snapshot: any, context: any): Promise<void> {
    const milestoneId = snapshot.id;
    const { projectId } = snapshot.data() as Milestone;
    const project = await this.findProjectInFirestore(projectId);
    if (!project) {
      // Project might be deleted. Lets delete all subtasks too
      return await subtasksService.deleteSubtasksForProject(milestoneId);
    }
    let milestones: string[] = [];
    if (project.milestones.includes(milestoneId)) {
      // Means we have to delete it from project
      paceLoggingService.log(
        `${ProjectService.name}.${projectService.updateMilestonesInProject.name}: Removing milestone from project`,
        { milestoneId }
      );
      milestones = project.milestones.filter((m) => m !== milestoneId);
      // Delete all subtasks connected to milestone
      await subtasksService.deleteSubtasksForProject(milestoneId);
    } else {
      // Means we have to add it to the project
      paceLoggingService.log(
        `${ProjectService.name}.${projectService.updateMilestonesInProject.name}: Adding milestone from project`,
        { milestoneId }
      );
      milestones = [...project.milestones, milestoneId];
    }
    await this.updateProject(project.uid, { milestones });
  }

  /**
   * Returns ProjectMember object
   * @param {string} name
   * @param {string} photoUrl
   */
  private async generateProjectMember(userId: string, role: ProjectMemberRole): Promise<ProjectMember> {
    paceLoggingService.log(`${ProjectService.name}.${this.generateProjectMember.name} Generating project member:`, {
      data: {
        userId,
        role,
      },
    });
    const user = (await userService.findUserInFirestore(userId)) as Partial<User>;

    const projectMember: ProjectMember = {
      uid: userId,
      name: user.name ?? "",
      role,
      photoUrl: user.photoUrl ?? "",
      avatarColor: user.avatarColor ?? "",
    };
    return projectMember;
  }
}

export const projectService = ProjectService.getInstance();
