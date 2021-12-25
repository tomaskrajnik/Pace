import { PaceColorsEnum } from "../../shared/enums/pace-colors.enum";

export interface CreateMilestoneRequest {
  projectId: string;
  name: string;
  description: string;
  color: string | PaceColorsEnum;
  startDate: number;
  endDate: number;
}

export interface UpdateMilestoneRequest {
  name: string;
  description: string;
  color: string | PaceColorsEnum;
  startDate: number;
  endDate: number;
}
