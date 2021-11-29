import { PaceColorsEnum } from "../../shared/enums/pace-colors.enum";

/**
 * class Milestone
 */
export class Milestone {
  public uid: string;
  public projectId: string;
  public name: string;
  public createdAt: number;
  public startDate: number;
  public endDate: number;
  public description?: string;
  public color: PaceColorsEnum | string;

  /**
   * class Milestone constructor
   * @param {any} constructorConfig
   */
  constructor(milestoneConfig: any) {
    this.uid = milestoneConfig.uid;
    this.projectId = milestoneConfig.projectId;
    this.name = milestoneConfig.name;
    this.createdAt = milestoneConfig.createdAt;
    this.startDate = milestoneConfig.startDate;
    this.endDate = milestoneConfig.endDate;
    this.description = milestoneConfig.description;
    this.color = milestoneConfig.color;
  }
}
