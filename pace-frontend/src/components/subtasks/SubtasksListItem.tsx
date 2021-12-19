import { CheckCircleIcon } from '@heroicons/react/solid';
import React, { useMemo, useState } from 'react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useSubtaskActions } from '../../hooks/useSubtaskActions';
import { Subtask, SubtaskMember, SubtasksStatus } from '../../models/subtasks.model';
import { RootState } from '../../store';
import { projectMembersSelector } from '../../store/projects/projects.selectors';
import NormalText from '../common/NormalText';
import { AssigneeSelector } from '../form/AssigneeSelector';
import { SubtaskStatusSelector } from '../form/SubtaskStatusSelector';

interface SubtaskListItemProps {
    subtask: Subtask;
    onClick: () => void;
}

export const SubtaskListItem: React.FC<SubtaskListItemProps> = ({ subtask: s, onClick }) => {
    if (!s) return null;
    const { projectId } = useParams<{ projectId: string }>();
    const [selectedStatus, setSelectedStatus] = useState<SubtasksStatus>(s.status);
    const [assignee, setAssignee] = useState<SubtaskMember | null>(s.assignee ?? null);
    const members = useSelector((state: RootState) => projectMembersSelector(state, projectId));
    const { updateSubtask } = useSubtaskActions();
    const subtaskMembers: SubtaskMember[] = useMemo(
        //@ts-ignore
        () => members.map(({ role, ...m }) => m),
        [members],
    );

    const renderIcon = useCallback(() => {
        switch (s.status) {
            case SubtasksStatus.Done:
                return <CheckCircleIcon className="w-5 h-5 mr-5 text-green-400" />;
            case SubtasksStatus.InProgress:
                return <CheckCircleIcon className="w-5 h-5 mr-5 text-yellow-400" />;
            case SubtasksStatus.ToDo:
                return <CheckCircleIcon className="w-5 h-5 mr-5 text-gray-400" />;
        }
    }, [s.status]);

    const handleStatusChange = async (status: SubtasksStatus) => {
        setSelectedStatus(status);
        await updateSubtask(s.uid, { status });
    };

    const handleAssigneeChange = async (assignee: SubtaskMember | null) => {
        setAssignee(assignee);
        await updateSubtask(s.uid, { assignee: assignee ?? 'unassigned' });
    };

    return (
        <div
            key={s.uid}
            className="tr-border-bottom hover:bg-gray-100 cursor-pointer flex flex-row justify-between px-5 items-center"
        >
            <div onClick={onClick} className="flex flex-row justify-start items-center hover:underline">
                {renderIcon()}
                <NormalText>{s.name}</NormalText>
            </div>
            <div className="flex flex-row justify-between">
                <div className="flex mr-4  h-full self-center items-center"></div>
                <AssigneeSelector
                    type="minimal"
                    members={subtaskMembers}
                    selected={assignee}
                    onSelected={handleAssigneeChange}
                />
                <div className="inline-block w-40 self-center -mt-1.5 h-full flex justify-end">
                    <SubtaskStatusSelector type="minimal" selected={selectedStatus} onSelected={handleStatusChange} />
                </div>
            </div>
        </div>
    );
};
