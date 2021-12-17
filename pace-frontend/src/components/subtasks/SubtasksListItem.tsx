import { CheckCircleIcon } from '@heroicons/react/solid';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Subtask, SubtaskMember, SubtasksStatus } from '../../models/subtasks.model';
import { RootState } from '../../store';
import { projectMembersSelector } from '../../store/projects/projects.selectors';
import { PaceColorsEnum } from '../../utils/colors';
import NormalText from '../common/NormalText';
import { AssigneeSelector } from '../form/AssigneeSelector';
import { SubtaskStatusSelector } from '../form/SubtaskStatusSelector';

interface SubtaskListItemProps {
    subtask: Subtask;
    color: string | PaceColorsEnum;
}

export const SubtaskListItem: React.FC<SubtaskListItemProps> = ({ subtask: s, color }) => {
    if (!s) return null;
    const { projectId } = useParams<{ projectId: string }>();
    const [selectedStatus, setSelectedStatus] = useState<SubtasksStatus>(s.status);
    const [assignee, setAssignee] = useState<SubtaskMember | null>(s.assignee ?? null);
    const members = useSelector((state: RootState) => projectMembersSelector(state, projectId));

    const subtaskMembers: SubtaskMember[] = useMemo(
        //@ts-ignore
        () => members.map(({ role, ...m }) => m),
        [members],
    );

    return (
        <div
            key={s.uid}
            className="tr-border-bottom hover:bg-gray-100 cursor-pointer flex flex-row justify-between px-5 items-center"
        >
            <div className="flex flex-row justify-start items-center">
                <CheckCircleIcon className="w-5 h-5 mr-5" style={{ color: color }} />
                <NormalText>{s.name}</NormalText>
            </div>
            <div className="flex flex-row justify-between">
                <div className="flex mr-4  h-full self-center items-center"></div>
                <AssigneeSelector
                    type="minimal"
                    members={subtaskMembers}
                    selected={assignee}
                    onSelected={setAssignee}
                />
                <div className="inline-block w-40 self-center -mt-1.5 h-full flex justify-end">
                    <SubtaskStatusSelector type="minimal" selected={selectedStatus} onSelected={setSelectedStatus} />
                </div>
            </div>
        </div>
    );
};
