import React, { useEffect, useState } from 'react';
import NormalText from '../../common/NormalText';
import 'gantt-task-react/dist/index.css';
import { Milestone } from '../../../models/milestones.model';
import { PaceColorsEnum } from '../../../utils/colors';
import { GantChart } from '../gantChart/GantChart';
import { useDispatch } from 'react-redux';
import { setMilestones } from '../../../store/milestones/milestones.actions';
import NormalButton from '../../common/NormalButton';
import { CreateMilestoneModal } from '../../milestones/CreateMilestoneModal';

const _milestones: Milestone[] = [
    {
        uid: 'skanfskla',
        startDate: new Date(2021, 8, 15).getTime(),
        endDate: new Date(2021, 8, 25).getTime(),
        createdAt: new Date(2021, 11, 22).getTime(),
        name: 'Website changes',
        color: PaceColorsEnum.GREEN_500,
        subtasks: [],
    },
    {
        uid: 'safafsdfs',
        startDate: new Date(2022, 1, 17).getTime(),
        endDate: new Date(2022, 3, 25).getTime(),
        createdAt: new Date(2021, 11, 14).getTime(),
        name: 'App improvements',
        color: PaceColorsEnum.INDIGO_500,
        subtasks: [],
    },
];

const ProjectMilestones: React.FC = ({}) => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setMilestones(_milestones));
    }, [_milestones]);

    return (
        <>
            <div>
                <div className="flex sm:mb-4 justify-between items-center">
                    <NormalText className="text-xl">Project milestones</NormalText>

                    <div>
                        <NormalButton
                            className="shadow"
                            title="Add milestone"
                            onClick={() => setCreateModalOpen(true)}
                        />
                    </div>
                </div>

                <GantChart />
            </div>
            <CreateMilestoneModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />
        </>
    );
};

export default ProjectMilestones;
