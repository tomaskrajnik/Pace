import { PaceColorsEnum } from '../utils/colors';
import { Subtask } from './subtasks.model';

/**
 * class Milestone
 */
export class Milestone {
    public uid: string;
    public name: string;
    public createdAt: number;
    public startDate: number;
    public endDate: number;
    public description?: string;
    public color: PaceColorsEnum | string;
    public projectId: string;
    public subtasks?: Subtask[];

    /**
     * class Milestone constructor
     * @param {any} constructorConfig
     */
    constructor(milestoneConfig: any) {
        this.uid = milestoneConfig.uid;
        this.name = milestoneConfig.name;
        this.createdAt = milestoneConfig.createdAt;
        this.startDate = milestoneConfig.startDate;
        this.endDate = milestoneConfig.endDate;
        this.description = milestoneConfig.description;
        this.color = milestoneConfig.color;
        this.projectId = milestoneConfig.projectId;
        this.subtasks = milestoneConfig.subtask;
    }
}
