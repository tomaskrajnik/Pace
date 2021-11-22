import React, { useMemo } from 'react';
import { ProjectMember } from '../../models/projects.model';
import ProfilePicture from './ProfilePicture';

interface AvatarGroupProps {
    projectMembers: ProjectMember[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ projectMembers }) => {
    const avatars = [...projectMembers];
    const shouldConcatenate = useMemo(() => avatars.length > 4, [avatars]);
    const number = avatars.splice(shouldConcatenate ? 3 : 4);
    return (
        <div className="flex -space-x-3 overflow-hidden">
            {avatars.map((pm, idx) => (
                <ProfilePicture name={pm.name} photoUrl={pm.photoUrl} avatarColor={pm.avatarColor} key={idx} />
            ))}

            {shouldConcatenate && (
                <div className="h-9 w-9 flex bg-gray-300 rounded-full rounded-lg items-center justify-center text-white">
                    <p className="text-sm">{`+${number.length}`}</p>
                </div>
            )}
        </div>
    );
};

export default AvatarGroup;
