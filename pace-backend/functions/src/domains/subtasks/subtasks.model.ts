export enum SubtasksStatus {
  Done = "Done",
  InProgress = "InProgress",
  ToDo = "ToDo",
}

export interface SubtaskMember {
  uid: string;
  name: string;
  photoUrl?: string;
  avatarColor: string;
}

export class Subtask {
  public uid: string;
  public name: string;
  public status: SubtasksStatus;
  public milestoneId: string;
  public createdAt: number;
  public assignee?: SubtaskMember | null;
  public reporter: SubtaskMember;
  public description?: string;

  constructor(substasksConfig: any) {
    this.uid = substasksConfig.uid;
    this.name = substasksConfig.name;
    this.status = substasksConfig.status;
    this.milestoneId = substasksConfig.milestoneId;
    this.createdAt = substasksConfig.createdAt;
    this.assignee = substasksConfig.assignee;
    this.reporter = substasksConfig.reporter;
    this.description = substasksConfig.description;
  }
}
