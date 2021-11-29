import { ProjectMemberRole } from "../projects/projects.model";

/**
 * class Invitation
 */
export class Invivation {
  public uid: string;
  public projectId: string;
  public email: string;
  public createdAt: number;
  public role: ProjectMemberRole;
  public accepted: boolean;
  public projectName: string;
  public invitedBy: string;

  /**
   * class Invitation constructor
   * @param {any} invitationConfig
   */
  constructor(projectConfig: any) {
    this.uid = projectConfig.uid;
    this.projectId = projectConfig.projectId;
    this.email = projectConfig.email;
    this.createdAt = projectConfig.createdAt;
    this.role = projectConfig.role;
    this.accepted = projectConfig.accepted;
    this.projectName = projectConfig.projectName;
    this.invitedBy = projectConfig.invitedBy;
  }
}
