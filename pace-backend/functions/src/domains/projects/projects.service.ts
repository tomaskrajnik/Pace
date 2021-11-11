import to from "await-to-js";
import { db } from "../../shared/database/admin";
import { databaseCollections } from "../../shared/enums/database-collections.enum";
import { paceLoggingService } from "../../utils/services/logger";
import { Invivation } from "../invitations/invitations.model";
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
   * @return {Promise<admin.auth.UserRecord>}
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
   * @param projectId
   * @param data
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
    const userHasPermission = await projectService.userHasPermissionToManipulateProject(userId, project);
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
    const data: Omit<Invivation, "uid"> = snapshot.data();
    const project = await this.findProjectInFirestore(data.projectId);
    if (!project) {
      return paceLoggingService.error("Project not found while updating invitations", { invitationId });
    }
    const invitations = [...project.invitations, invitationId];
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
      paceLoggingService.error("Error while leaving project - no corresponding memer found");
      return { error: "User is not a member of requested project" };
    }

    if (member.role === ProjectMemberRole.OWNER) {
      // Delete project if the owner removes it
      return await this.deleteProject(projectId);
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
    };
    return projectMember;
  }
}

export const projectService = ProjectService.getInstance();