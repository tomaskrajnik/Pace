import React, { useMemo } from 'react';

interface ProfilePictureProps {
    name: string;
    photoUrl?: string;
    avatarColor: string;
    size?: 'small' | 'medium' | 'large';
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ name, photoUrl, avatarColor, size = 'small' }) => {
    const userHasProfilePhoto = useMemo(() => (photoUrl?.length ? true : false), [photoUrl]);
    const splitName = useMemo(() => name.match(/\b(\w)/g), [name]);

    const avatarSize: { size: number; fontSize: string } = useMemo(() => {
        if (size === 'large') return { size: 20, fontSize: 'text-2xl' };
        if (size === 'medium') return { size: 16, fontSize: 'text-md' };
        return { size: 9, fontSize: 'text-sm' };
    }, [size]);

    const Avatar = () => (
        <div
            style={{ backgroundColor: avatarColor }}
            className={`h-${avatarSize.size} w-${avatarSize.size} flex rounded-full rounded-lg items-center justify-center text-white`}
        >
            <p className={avatarSize.fontSize}>{splitName && splitName.join('')}</p>
        </div>
    );

    return userHasProfilePhoto ? (
        <img
            className={`h-${avatarSize.size} w-${avatarSize.size} rounded-full`}
            src={photoUrl}
            alt={`${name}-pace-photo-avatar`}
        />
    ) : (
        <Avatar />
    );
};

export default ProfilePicture;
