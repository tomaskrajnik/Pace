import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Milestone } from '../../models/milestones.model';
import MilestonesService from '../../services/MilestonesService';
import { SlideOver } from '../layout/SlideOver';
import { WarningPopUp } from '../layout/WarningPopUp';

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
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return () => setEditModeOn(false);
    }, [isOpen]);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await MilestonesService.deleteMilestone(milestone.uid);
            toast.success('Milestone successfully deleted');
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SlideOver headerBackgroundColor={milestone.color} title="Preview milestone" isOpen={isOpen} onClose={onClose}>
            {editModeOn ? (
                <EditMilestoneForm onEditModeExit={() => setEditModeOn(false)} milestone={milestone} />
            ) : (
                <PreviewMilestone
                    onEditPressed={() => setEditModeOn(true)}
                    milestone={milestone}
                    onDeletePressed={() => setDeleteModalVisible(true)}
                />
            )}
            <WarningPopUp
                loading={loading}
                onAction={handleDelete}
                action="Delete"
                onClose={() => setDeleteModalVisible(false)}
                isOpen={deleteModalVisible}
                header="Are you sure you want to delete this milestone?"
                text="All tasks will be deleted too"
            />
        </SlideOver>
    );
};
