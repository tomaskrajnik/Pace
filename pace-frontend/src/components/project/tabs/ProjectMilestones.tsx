import React, { useState } from 'react';
import NormalText from '../../common/NormalText';
import 'gantt-task-react/dist/index.css';
import { GantChart } from '../gantChart/GantChart';
import NormalButton from '../../common/NormalButton';
import { CreateMilestoneModal } from '../../milestones/CreateMilestoneModal';
import { useLoadingDebounce } from '../../../hooks/useLoadingDebounce';
import { useSelector } from 'react-redux';
import { milestonesLoadingSelector } from '../../../store/milestones/milestones.selector';
import Skeleton from 'react-loading-skeleton';

const ProjectMilestones: React.FC = ({}) => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const milestonesLoading = useSelector(milestonesLoadingSelector);
    const loading = useLoadingDebounce(milestonesLoading, 200);

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
                {loading ? (
                    <Skeleton style={{ borderRadius: '10px', marginTop: '20px' }} height={176} />
                ) : (
                    <GantChart onAddNew={() => setCreateModalOpen(true)} />
                )}
            </div>
            <CreateMilestoneModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />
        </>
    );
};

export default ProjectMilestones;
