import React, { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/auth/auth.selectors';
import { RootState } from '../../store';
import { projectByIdSelector } from '../../store/projects/projects.selectors';
import { Project } from '../../models/projects.model';
import { User } from '../../models/user.model';
import Screen from '../../components/layout/Screen';
import { useSubscribeToMilestone } from '../../hooks/useSubscribeToMilestone';
import NormalText from '../../components/common/NormalText';
import { AuthRoutes } from '../../routes/routes.types';
import { Link, Redirect } from 'react-router-dom';
import { EditMilestoneForm } from '../../components/milestones/EditMilestoneForm';
import { PreviewMilestone } from '../../components/milestones/PreviewMilestone';
import { WarningPopUp } from '../../components/layout/WarningPopUp';
import { toast } from 'react-toastify';
import MilestonesService from '../../services/MilestonesService';
import Skeleton from 'react-loading-skeleton';
import { useLoadingDebounce } from '../../hooks/useLoadingDebounce';

export const Milestone: React.FC = () => {
    const { projectId, milestoneId: _milestoneId } = useParams<{ projectId: string; milestoneId: string }>();
    const [editModeOn, setEditModeOn] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    // This has to be here
    const milestoneId = _milestoneId.slice(0, -1);

    const user: User = useSelector(userSelector);
    const project: Project = useSelector((state: RootState) => projectByIdSelector(state, projectId));
    if (!user || !project) return null;

    const userHasAccess = useMemo(() => project.members.some((m) => m.uid === user.uid), [user, project]);
    if (!userHasAccess) return null;

    const { milestone, loading: milestoneLoading } = useSubscribeToMilestone(projectId, milestoneId);

    const loading = useLoadingDebounce(milestoneLoading);

    const renderContent = useCallback(() => {
        if (loading) return <Skeleton height={250} />;
        if (!milestone) return <Redirect to={AuthRoutes.NotFound} />;
        if (editModeOn)
            return (
                <div className=" px-6 py-2">
                    <EditMilestoneForm onEditModeExit={() => setEditModeOn(false)} milestone={milestone} />
                </div>
            );
        return (
            <div className=" px-6 py-2">
                <PreviewMilestone
                    onEditPressed={() => setEditModeOn(true)}
                    milestone={milestone}
                    onDeletePressed={() => setDeleteModalVisible(true)}
                />
            </div>
        );
    }, [editModeOn, loading, milestone]);

    const handleDelete = async () => {
        if (!milestone) return;
        try {
            setLoadingDelete(true);
            await MilestonesService.deleteMilestone(milestone.uid);
            toast.success('Milestone successfully deleted');
            document.location.href = `${AuthRoutes.Project}/${projectId}`;
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoadingDelete(false);
        }
    };

    return (
        <Screen>
            <div role="presentation" onClick={(e) => e.preventDefault()}>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                    <Link to={`${AuthRoutes.Dashboard}`}>
                        <NormalText className="hover:underline text-white">Projects</NormalText>
                    </Link>
                    <Link to={`${AuthRoutes.Project}/${projectId}`}>
                        <NormalText className="hover:underline text-white">Milestones</NormalText>
                    </Link>
                    <NormalText>{milestone?.name}</NormalText>
                </Breadcrumbs>
            </div>
            <div className="mt-8 shadow bg-white border border-gray-200 sm:rounded-lg">{renderContent()}</div>
            <WarningPopUp
                loading={loadingDelete}
                onAction={handleDelete}
                action="Delete"
                onClose={() => setDeleteModalVisible(false)}
                isOpen={deleteModalVisible}
                header="Are you sure you want to delete this milestone?"
                text="All tasks will be deleted too"
            />
        </Screen>
    );
};
