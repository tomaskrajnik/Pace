import { Menu, Transition } from '@headlessui/react';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import React, { Fragment, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Project } from '../../models/projects.model';
import { AuthRoutes } from '../../routes/routes.types';
import ProjectService from '../../services/ProjectService';
import { userSelector } from '../../store/auth/auth.selectors';
import { classNames } from '../../utils/formatting';
import AvatarGroup from '../common/AvatarGroup';
import NormalText from '../common/NormalText';
import { WarningPopUp } from '../layout/WarningPopUp';
import { ProjectBadge } from './ProjectBadge';

interface ProjectListItemVerticalProps {
    project: Project;
}

const ProjectListItemVertical: React.FC<ProjectListItemVerticalProps> = ({ project }) => {
    const user = useSelector(userSelector);
    if (!user || !project) return null;
    const [leaveModalOpen, setLeaveModalOpen] = useState(false);
    const [leaveButtonLoading, setLeaveButtonLoading] = useState(false);

    const userRole = useMemo(() => project.members.filter((u) => u.uid === user.uid)[0].role, [project.members]);

    const onLeaveProject = async () => {
        try {
            setLeaveButtonLoading(true);
            await ProjectService.leaveProject(project.uid);
            toast.success('Success');
        } catch (err) {
            toast.error('Something went wrong');
            console.log(err);
        } finally {
            setLeaveButtonLoading(false);
            setLeaveModalOpen(false);
        }
    };

    return (
        <>
            <Menu as="div">
                <div className="relative">
                    <Link to={`${AuthRoutes.Project}/${project.uid}`}>
                        <div className="flex flex-col bg-white h-44 rounded-lg shadow border border-gray-200 p-4 cursor-pointer hover:bg-gray-50">
                            <div>
                                <div className="flex justify-between">
                                    <div>
                                        <div className="flex items-center">
                                            {project.photoUrl && (
                                                <img
                                                    className="h-9 w-9 mr-2 rounded-full"
                                                    src={project.photoUrl}
                                                    alt={project.name}
                                                />
                                            )}
                                            <NormalText className="font-semibold text-grey-300 text-xl">
                                                {project.name}
                                            </NormalText>
                                        </div>
                                        <ProjectBadge role={userRole} />
                                    </div>

                                    <Menu.Button className="w-7 h-7 p-1.5 rounded hover:bg-blue-100">
                                        <DotsHorizontalIcon className="text-gray-700 hover:text-blue-700" />
                                    </Menu.Button>
                                </div>
                            </div>
                            <div className="flex mt-auto justify-between">
                                <AvatarGroup projectMembers={project.members} />
                            </div>
                        </div>
                    </Link>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="origin-top-right absolute right-5 -mt-32 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                                {({ active }) => (
                                    <Link to={`${AuthRoutes.Project}/${project.uid}`}>
                                        <button
                                            className={classNames(
                                                active ? 'bg-blue-100 text-blue-500' : '',
                                                'block m-0 w-full text-left px-4 py-2 text-sm text-gray-700',
                                            )}
                                        >
                                            Open project
                                        </button>
                                    </Link>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => setLeaveModalOpen(true)}
                                        className={classNames(
                                            active ? 'bg-red-100 text-red-600 ' : '',
                                            'block w-full text-left px-4 py-2 text-sm text-red-600 w-100',
                                        )}
                                    >
                                        Leave project
                                    </button>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </div>
            </Menu>

            <WarningPopUp
                onAction={onLeaveProject}
                onClose={() => setLeaveModalOpen(false)}
                isOpen={leaveModalOpen}
                text="Are you sure you want to leave this project? You will have to be invited again or create a new one from scratch"
                header="You are about to leave this project"
                action="Leave"
                loading={leaveButtonLoading}
            />
        </>
    );
};

export default ProjectListItemVertical;
