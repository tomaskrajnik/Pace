import { SubtaskMember, SubtasksStatus } from "./subtasks.model";

export interface CreateSubtasktRequest {
  name: string;
  milestoneId: string;
  status: SubtasksStatus;
  assignee?: SubtaskMember;
  description?: string;
}
