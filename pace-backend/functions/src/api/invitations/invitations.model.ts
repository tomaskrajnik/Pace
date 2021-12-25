import { ProjectMemberRole } from "../projects/projects.model";
/**
 * class Invitation
 */
export class Invitation {
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
  constructor(invitationConfig: any) {
    this.uid = invitationConfig.uid;
    this.projectId = invitationConfig.projectId;
    this.email = invitationConfig.email;
    this.createdAt = invitationConfig.createdAt;
    this.role = invitationConfig.role;
    this.accepted = invitationConfig.accepted;
    this.projectName = invitationConfig.projectName;
    this.invitedBy = invitationConfig.invitedBy;
  }
}
