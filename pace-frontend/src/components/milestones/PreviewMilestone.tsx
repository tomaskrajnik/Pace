import { CalendarIcon, PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link, useParams } from 'react-router-dom';
import { useSubscribeToSubtasks } from '../../hooks/useSubscribeToSubtasks';
import { Milestone } from '../../models/milestones.model';
import { Subtask, SubtasksStatus } from '../../models/subtasks.model';
import { AuthRoutes } from '../../routes/routes.types';
import NormalButton from '../common/NormalButton';
import NormalText from '../common/NormalText';
import { CreateSubtaskModal } from '../subtasks/CreateSubtaskModal';
import { PreviewSubtaskModal } from '../subtasks/PreviewSubtaskModal';
import { SubtaskListItem } from '../subtasks/SubtasksListItem';

interface PreviewMilestoneProps {
    milestone: Milestone;
    onEditPressed?: () => void;
    onDeletePressed?: () => void;
}

const SORT_ORDER = [SubtasksStatus.Done, SubtasksStatus.InProgress, SubtasksStatus.ToDo];

export const PreviewMilestone: React.FC<PreviewMilestoneProps> = ({ milestone, onEditPressed, onDeletePressed }) => {
    const { projectId } = useParams<{ projectId: string }>();
    const { subtasks, loading } = useSubscribeToSubtasks(milestone.uid);

    const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
    const [subtaskToPreview, setSubtaskToPreview] = useState<Subtask | null>(null);

    const renderContent = useCallback(() => {
        if (loading) return <Skeleton height={48} />;
        if (subtasks?.length) {
            return subtasks
                .sort((a, b) => SORT_ORDER.indexOf(a.status) - SORT_ORDER.indexOf(b.status))
                .map((s) => <SubtaskListItem onClick={() => setSubtaskToPreview(s)} key={s.uid} subtask={s} />);
        }
        return (
            <div className="h-48 flex flex-col items-center justify-center">
                <NormalText>You don't have any subtasks yet</NormalText>
                <div className="w-32 mt-6 self-center">
                    <NormalButton title="+ Create" onClick={() => setCreateTaskModalOpen(true)} variant="primary" />
                </div>
            </div>
        );
    }, [subtasks, loading]);

    if (!subtasks) return null;

    const finishedSubtasks = subtasks.filter((s) => s.status === SubtasksStatus.Done).length;
    const inProgressSubtasks = subtasks.filter((s) => s.status === SubtasksStatus.InProgress).length;

    const finishedPercentage = (finishedSubtasks / subtasks.length) * 100;
    const inProgressPercentage = (inProgressSubtasks / subtasks.length) * 100;

    return (
        <>
            <div className="bg-white rounded-lg pb-4 sm:pb-4">
                <div className="col-span-3 mt-3 sm:col-span-2">
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <div className="w-5 h-5 rounded-md mr-2" style={{ backgroundColor: milestone.color }}></div>
                            <Link to={`${AuthRoutes.Project}/${projectId}${AuthRoutes.Milestone}/${milestone.uid}}`}>
                                <NormalText className="text-2xl hover:underline">{milestone.name}</NormalText>
                            </Link>
                        </div>
                        <div className="flex">
                            {onEditPressed && (
                                <button
                                    onClick={onEditPressed}
                                    className="px-4 py-2 items-center text-sm font-bold text-gray-400 rounded-md bg-gray-50 hover:bg-gray-100 flex mr-2"
                                >
                                    <PencilAltIcon className="w-4 h-4 text-gray-400 mr-1" />
                                    Edit
                                </button>
                            )}
                            {onDeletePressed && (
                                <button
                                    onClick={onDeletePressed}
                                    className="px-4 py-2 items-center text-sm font-bold text-red-400 rounded-md bg-red-50 hover:bg-red-100 flex"
                                >
                                    <TrashIcon className="w-4 h-4 text-red-400 mr-1" />
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 mb-4">
                        <NormalText className="font-bold mr-1">
                            <span className="text-gray-500 text-sm">Progress:</span>
                        </NormalText>
                        <div className=" h-3 flex flex-row rounded-full sm:max-w-2xl mt-4 w-full overflow-hidden bg-gray-200">
                            <div className="bg-green-400 h-3" style={{ width: `${finishedPercentage}%` }}></div>
                            <div className="bg-yellow-400 h-3" style={{ width: `${inProgressPercentage}%` }}></div>
                        </div>
                    </div>
                    <div className="flex mt-6 items-center">
                        <CalendarIcon className="text-gray-500 w-4 h-4 mr-1" />
                        <NormalText className="font-bold mr-1">
                            <span className="text-gray-500 text-sm">Sart date:</span>
                        </NormalText>
                        <NormalText className="text-gray-500 font-md">
                            {moment(new Date(milestone.startDate)).format('MM-DD-YYYY')}
                        </NormalText>
                    </div>
                    <div className="flex mt-2 items-center">
                        <CalendarIcon className="text-gray-500 w-4 h-4 mr-1" />
                        <NormalText className="font-bold mr-1">
                            <span className="text-gray-500 text-sm">End date:</span>
                        </NormalText>
                        <NormalText className="text-gray-500 font-md">
                            {moment(new Date(milestone.endDate)).format('MM-DD-YYYY')}
                        </NormalText>
                    </div>
                    <div className="mt-4">
                        <NormalText className="font-bold mr-1">
                            <span className="text-gray-500 text-sm">Description:</span>
                        </NormalText>
                        <NormalText className="text-gray-500 font-md">{`${
                            milestone.description ?? 'No description'
                        }`}</NormalText>
                    </div>
                    <div className="mt-4 flex items-center flex-row justify-between">
                        <NormalText className="font-bold mr-1">
                            <span className="text-gray-500 text-sm">Subtasks:</span>
                        </NormalText>
                        <div className="w-30">
                            <NormalButton
                                className="shadow"
                                variant="primary"
                                title="+  Create subtask"
                                onClick={() => setCreateTaskModalOpen(true)}
                            />
                        </div>
                    </div>

                    <div className="mt-6 border border-gray-200 rounded-lg shadow bg-gray-50 w-100">
                        {renderContent()}
                    </div>
                </div>
            </div>
            <CreateSubtaskModal
                isOpen={createTaskModalOpen}
                onClose={() => setCreateTaskModalOpen(false)}
                milestoneId={milestone.uid}
            />
            <PreviewSubtaskModal
                milestoneId={milestone.uid}
                subtaskToPreview={subtaskToPreview}
                onClose={() => setSubtaskToPreview(null)}
            />
        </>
    );
};
