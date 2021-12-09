import React from 'react';
import NormalText from '../common/NormalText';

export const MilestoneListHeader: React.FC<{
    headerHeight: number;
    rowWidth: string;
}> = ({ headerHeight, rowWidth }) => {
    return (
        <div
            className="flex p-2 items-center bg-white tr-border-right tr-border-bottom"
            style={{
                height: headerHeight,
                minWidth: rowWidth,
            }}
        >
            <NormalText className="ml-2">Milestones</NormalText>
        </div>
    );
};
