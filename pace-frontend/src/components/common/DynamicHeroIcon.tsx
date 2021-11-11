import React from 'react';
import * as HeroIcons from '@heroicons/react/solid';

export type IconName = keyof typeof HeroIcons;
type DynamicHeroIconProps = {
    icon: IconName;
    className?: string;
};

// Helper component to dynamically load HeroIcons
const DynamicHeroIcon: React.FC<DynamicHeroIconProps> = ({ icon, className }) => {
    //@ts-ignore
    const Icon = HeroIcons[icon];

    return (
        <>
            <Icon className={className} aria-hidden="true" />
        </>
    );
};

export default DynamicHeroIcon;
