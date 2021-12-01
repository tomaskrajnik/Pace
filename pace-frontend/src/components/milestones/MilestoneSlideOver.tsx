import React, { useEffect, useState } from 'react';
import { Milestone } from '../../models/milestones.model';
import { SlideOver } from '../layout/SlideOver';

import { EditMilestoneForm } from './EditMilestoneForm';
import { PreviewMilestone } from './PreviewMilestone';

interface MilestoneSlideOverProps {
    milestone: Milestone | null;
    isOpen: boolean;
    onClose: () => void;
}

export const MilestoneSlideOver: React.FC<MilestoneSlideOverProps> = ({ milestone, isOpen, onClose }) => {
    if (!milestone) return null;
    const [editModeOn, setEditModeOn] = useState(false);

    useEffect(() => {
        return setEditModeOn(false);
    }, []);

    return (
        <SlideOver headerBackgroundColor={milestone.color} title="Preview milestone" isOpen={isOpen} onClose={onClose}>
            {editModeOn ? (
                <EditMilestoneForm onEditModeExit={() => setEditModeOn(false)} milestone={milestone} />
            ) : (
                <PreviewMilestone onEditPressed={() => setEditModeOn(true)} milestone={milestone} />
            )}
        </SlideOver>
    );
};
