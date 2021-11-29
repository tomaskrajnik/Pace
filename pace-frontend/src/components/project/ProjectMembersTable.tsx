import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import { Project, ProjectMember, ProjectMemberRole } from '../../models/projects.model';
import { User } from '../../models/user.model';
import ProjectService from '../../services/ProjectService';
import { classNames } from '../../utils/formatting';
import NormalButton from '../common/NormalButton';
import NormalText from '../common/NormalText';
import ProfilePicture from '../common/ProfilePicture';
import { WarningPopUp } from '../layout/WarningPopUp';
import { InviteMemberModal } from './InviteMemberModal';
import { ProjectBadge } from './ProjectBadge';
import { UpdateMemberRoleModal } from './UpdateMemberRoleModal';

interface ProjectMembersRoleTableProps {
    project: Project;
    userRole: ProjectMemberRole;
    user: User;
}

export const ProjectMembersTable: React.FC<ProjectMembersRoleTableProps> = ({ project, userRole, user }) => {
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [updateRoleMember, setUpdateRoleMember] = useState<ProjectMember | null>();
    const [memberToDelete, setMembertoDelete] = useState<ProjectMember | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRemoveMember = async () => {
        if (!memberToDelete) return;
        try {
            setLoading(true);
            await ProjectService.removeMemberFromProject(memberToDelete.uid, project.uid);
            toast.success('User removed from the project');
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!project || !userRole) return null;
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
                    <div className="-my-2 sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden  border-b border-gray-200 sm:rounded-lg">
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
                                        {project.members.map((m) => (
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

                                                <td className="px-6 py-4 whitespace-nowrap relative text-right text-sm font-medium">
                                                    <Menu as="div">
                                                        {userRole === ProjectMemberRole.OWNER && m.uid !== user.uid && (
                                                            <Menu.Button className="text-blue-500 hover:text-indigo-900">
                                                                Edit
                                                            </Menu.Button>
                                                        )}
                                                        <Transition
                                                            as={Fragment}
                                                            enter="transition ease-out duration-100"
                                                            enterFrom="transform opacity-0 scale-95"
                                                            enterTo="transform opacity-100 scale-100"
                                                            leave="transition ease-in duration-75"
                                                            leaveFrom="transform opacity-100 scale-100"
                                                            leaveTo="transform opacity-0 scale-95"
                                                        >
                                                            <Menu.Items className="origin-top-right absolute right-5  -mt-16 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                                <Menu.Item>
                                                                    {({ active }) => (
                                                                        <button
                                                                            onClick={() => setUpdateRoleMember(m)}
                                                                            className={classNames(
                                                                                active
                                                                                    ? 'bg-blue-100 text-red-600 '
                                                                                    : '',
                                                                                'block w-full text-left px-4 py-2 text-sm text-blue-600 w-100',
                                                                            )}
                                                                        >
                                                                            Update role
                                                                        </button>
                                                                    )}
                                                                </Menu.Item>
                                                                <Menu.Item>
                                                                    {({ active }) => (
                                                                        <button
                                                                            onClick={() => setMembertoDelete(m)}
                                                                            className={classNames(
                                                                                active
                                                                                    ? 'bg-red-100 text-red-600 '
                                                                                    : '',
                                                                                'block w-full text-left px-4 py-2 text-sm text-red-600 w-100',
                                                                            )}
                                                                        >
                                                                            Remove user
                                                                        </button>
                                                                    )}
                                                                </Menu.Item>
                                                            </Menu.Items>
                                                        </Transition>
                                                    </Menu>
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
            <InviteMemberModal
                invitedBy={user.email}
                project={project}
                isOpen={inviteModalOpen}
                onClose={() => setInviteModalOpen(false)}
            />
            <UpdateMemberRoleModal
                isOpen={updateRoleMember ? true : false}
                onClose={() => setUpdateRoleMember(null)}
                project={project}
                member={updateRoleMember ?? null}
            />
            <WarningPopUp
                loading={loading}
                header={`Are you sure you want to remove ${memberToDelete?.name} from this project ?`}
                isOpen={memberToDelete ? true : false}
                action="Yes"
                text="You will have to invite the user again"
                onAction={() => {
                    handleRemoveMember().then(() => setMembertoDelete(null));
                }}
                onClose={() => setMembertoDelete(null)}
            />
        </>
    );
};
