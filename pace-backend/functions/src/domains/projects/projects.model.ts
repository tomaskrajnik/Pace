export enum ProjectMemberRole {
  OWNER = "owner",
  EDITOR = "editor",
  VIEWER = "viewer",
}

export interface ProjectMember {
  uid: string;
  name: string;
  role: ProjectMemberRole;
  photoUrl?: string;
}

/**
 * class Project
 */
export class Project {
  public uid: string;
  public name: string;
  public createdAt: number;
  public milestones: string[];
  public members: ProjectMember[];
  public invitations: string[];
  public photoUrl?: string;

  /**
   * class Project constructor
   * @param {any} projectConfig
   */
  constructor(projectConfig: any) {
    this.uid = projectConfig.uid;
    this.name = projectConfig.name;
    this.createdAt = projectConfig.createdAt;
    this.milestones = projectConfig.milestones;
    this.members = projectConfig.members;
    this.invitations = projectConfig.invitations;
    this.photoUrl = projectConfig.photoUrl;
  }
}
