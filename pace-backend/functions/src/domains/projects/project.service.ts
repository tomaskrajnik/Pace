import to from "await-to-js";
import { db } from "../../shared/database/admin";
import { databaseCollections } from "../../shared/enums/database-collections.enum";
import { paceLoggingService } from "../../utils/services/logger";
import { User } from "../users/users.model";
import { userService } from "../users/users.service";
import { Project, ProjectMember, ProjectMemberRole } from "./project.model";
import { CreateProjectRequest } from "./project.types";

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
      paceLoggingService.error(`Error while deleting firebase user with id: ${projectId} -->`, err);
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
   * Returns ProjectMember object
   * @param {string} name
   * @param {string} photoUrl
   */
  private async generateProjectMember(userId: string, role: ProjectMemberRole): Promise<ProjectMember | null> {
    paceLoggingService.log(`${ProjectService.name}.${this.generateProjectMember.name} Generating project memer:`, {
      data: {
        userId,
        role,
      },
    });
    const user = (await userService.findUserInFirestore(userId)) as Partial<User>;
    if (!user) return null;

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
