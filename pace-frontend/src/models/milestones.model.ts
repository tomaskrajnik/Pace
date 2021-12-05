import { PaceColorsEnum } from '../utils/colors';

/**
 * class Milestone
 */
export class Milestone {
    public uid: string;
    public name: string;
    public subtasks: string[];
    public createdAt: number;
    public startDate: number;
    public endDate: number;
    public description?: string;
    public color: PaceColorsEnum | string;
    public projectId: string;

    /**
     * class Milestone constructor
     * @param {any} constructorConfig
     */
    constructor(milestoneConfig: any) {
        this.uid = milestoneConfig.uid;
        this.name = milestoneConfig.name;
        this.subtasks = milestoneConfig.subtasks;
        this.createdAt = milestoneConfig.createdAt;
        this.startDate = milestoneConfig.startDate;
        this.endDate = milestoneConfig.endDate;
        this.description = milestoneConfig.description;
        this.color = milestoneConfig.color;
        this.projectId = milestoneConfig.projectId;
    }
}
