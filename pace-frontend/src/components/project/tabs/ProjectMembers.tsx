import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { RootState } from '../../../store';
import { userSelector } from '../../../store/auth/auth.selectors';
import { projectByIdSelector, projectUserRoleSelector } from '../../../store/projects/projects.selectors';
import { PendingInvitationTable } from '../../invitations/PendingInvitationsTable';
import { ProjectMembersTable } from '../ProjectMembersTable';

const ProjectMembers: React.FC = () => {
    const user = useSelector(userSelector);
    const { projectId } = useParams<{ projectId: string }>();
    const project = useSelector((state: RootState) => projectByIdSelector(state, projectId));
    const userRole = useSelector((state: RootState) => projectUserRoleSelector(state, projectId));
    if (!user || !project || !userRole) return null;

    return (
        <>
            <ProjectMembersTable project={project} user={user} userRole={userRole} />

            {project.invitations && project.invitations.length !== 0 && (
                <PendingInvitationTable invitationsIds={project.invitations} />
            )}
        </>
    );
};

export default ProjectMembers;
