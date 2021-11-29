import React, { useCallback, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import NormalButton from '../../components/common/NormalButton';
import NormalHeader from '../../components/common/NormalHeader';
import NormalText from '../../components/common/NormalText';
import Screen from '../../components/layout/Screen';
import ProjectListItemVertical from '../../components/project/ProjectListItemVertical';
import { userSelector } from '../../store/auth/auth.selectors';
import { projectsLoadingSelector, projectsSelector } from '../../store/projects/projects.selectors';
import 'react-loading-skeleton/dist/skeleton.css';
import { CreateProjectModal } from '../../components/project/CreateProjectModal';
import { useLoadingDebounce } from '../../hooks/useLoadingDebounce';
import { invitationsSelector } from '../../store/invitations/invitations.selector';
import { PendingInvitation } from '../../components/invitations/PendingInvitation';

const Dashboard: React.FC = ({}) => {
    const user = useSelector(userSelector);
    const projects = useSelector(projectsSelector);
    const projectsLoading = useSelector(projectsLoadingSelector);
    const invitations = useSelector(invitationsSelector);
    if (!user) return null;

    const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);
    const showLoader = useLoadingDebounce(projectsLoading);

    console.log(projects);

    const renderContent = useCallback(() => {
        // Skeleton loader
        if (showLoader) {
            return (
                <>
                    <Skeleton height={176} />
                    <Skeleton height={176} />
                </>
            );
        }

        // Project feed
        if (projects?.length) {
            return projects.map((p) => <ProjectListItemVertical project={p} key={p.uid} />);
        }

        // Empty stage
        return <NormalText className="text-gray-50">You currently don't have any projects</NormalText>;
    }, [showLoader]);

    return (
        <Screen>
            <NormalHeader>{`Welcome, ${user.name.split(' ')[0]}!`}</NormalHeader>
            <div>
                <div className="flex mt-10 sm:mb-4 justify-between">
                    <NormalText className="text-xl">Projects</NormalText>
                    <div>
                        <NormalButton
                            className="shadow"
                            title="Create new"
                            onClick={() => setCreateProjectModalOpen(true)}
                        />
                    </div>
                </div>

                {invitations && invitations?.length !== 0 && <PendingInvitation invitation={invitations[0]} />}
                <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-1 md:mt-8">{renderContent()}</div>
            </div>
            <CreateProjectModal isOpen={createProjectModalOpen} onClose={() => setCreateProjectModalOpen(false)} />
        </Screen>
    );
};

export default Dashboard;
