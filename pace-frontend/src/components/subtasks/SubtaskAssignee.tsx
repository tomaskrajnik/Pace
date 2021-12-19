import { UserCircleIcon } from '@heroicons/react/solid';
import React, { useMemo } from 'react';
import { SubtaskMember } from '../../models/subtasks.model';
import NormalText from '../common/NormalText';
import ProfilePicture from '../common/ProfilePicture';

interface SubtaskAssigneeProps {
    member: SubtaskMember | null;
    hideName?: boolean;
    size?: 'small' | 'medium' | 'large';
}

export const SubtaskAssignee: React.FC<SubtaskAssigneeProps> = ({ member, hideName, size = 'small' }) => {
    const avatarSize: number = useMemo(() => {
        if (size === 'large') return 20;
        if (size === 'medium') return 16;
        return 9;
    }, [size, member]);

    if (member)
        return (
            <div className="flex px-1 flex-direction py-2 items-center">
                <ProfilePicture size={size} name={member.name} avatarColor={member.avatarColor} />
                {!hideName && <NormalText className="ml-3">{member.name}</NormalText>}
            </div>
        );
    return (
        <div className="flex  px-1 flex-direction py-2 items-center">
            <div className={`w-${avatarSize} h-${avatarSize} rounded-full bg-gray-200`}>
                <UserCircleIcon className="text-gray-400" />
            </div>
            {!hideName && <NormalText className="ml-3">Unassigned</NormalText>}
        </div>
    );
};
