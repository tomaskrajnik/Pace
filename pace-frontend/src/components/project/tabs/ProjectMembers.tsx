import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { ProjectMember, ProjectMemberRole } from '../../../models/projects.model';
import { RootState } from '../../../store';
import { userSelector } from '../../../store/auth/auth.selectors';
import { projectByIdSelector, projectUserRoleSelector } from '../../../store/projects/projects.selectors';
import NormalButton from '../../common/NormalButton';
import NormalText from '../../common/NormalText';
import ProfilePicture from '../../common/ProfilePicture';
import { PendingInvitationTable } from '../../invitations/PendingInvitationsTable';
import { InviteMemberModal } from '../InviteMemberModal';
import { ProjectBadge } from '../ProjectBadge';

interface ProjectMembersProps {
    members: ProjectMember[];
}

const ProjectMembers: React.FC<ProjectMembersProps> = ({ members }) => {
    const user = useSelector(userSelector);
    const { id: projectId } = useParams<{ id: string }>();
    const project = useSelector((state: RootState) => projectByIdSelector(state, projectId));
    const userRole = useSelector((state: RootState) => projectUserRoleSelector(state, projectId));
    if (!user || !project) return null;
    const [inviteModalOpen, setInviteModalOpen] = useState(false);

    return (
        <>
            <div>
                <div className="flex sm:mb-4 justify-between">
                    <NormalText className="text-xl">Project members</NormalText>
                    {userRole !== ProjectMemberRole.VIEWER && (
                        <div>
                            <NormalButton
                                className="shadow"
                                title="Invite member"
                                onClick={() => setInviteModalOpen(true)}
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow-md overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-white">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Name
                                            </th>

                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Role
                                            </th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {members.map((m) => (
                                            <tr key={m.uid}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <ProfilePicture
                                                                name={m.name}
                                                                photoUrl={m.photoUrl}
                                                                avatarColor={m.avatarColor}
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {m.uid === user.uid ? 'You' : m.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <ProjectBadge role={m.role} />
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {userRole !== ProjectMemberRole.VIEWER && (
                                                        <a href="#" className="text-blue-500 hover:text-indigo-900">
                                                            Edit
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {project.invitations.length && <PendingInvitationTable invitationsIds={project.invitations} />}
            <InviteMemberModal
                invitedBy={user.email}
                project={project}
                isOpen={inviteModalOpen}
                onClose={() => setInviteModalOpen(false)}
            />
        </>
    );
};

export default ProjectMembers;
