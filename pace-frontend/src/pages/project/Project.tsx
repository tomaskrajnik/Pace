import { Tab } from '@headlessui/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import NormalHeader from '../../components/common/NormalHeader';
import { classNames } from '../../utils/formatting';
import Screen from '../../components/layout/Screen';
import { RootState } from '../../store';
import { projectByIdSelector, projectUserRoleSelector } from '../../store/projects/projects.selectors';
import { CogIcon, TableIcon, UsersIcon } from '@heroicons/react/solid';
import ProjectMilestones from '../../components/project/tabs/ProjectMilestones';
import ProjectSettings from '../../components/project/tabs/ProjectSettings';
import ProjectMembers from '../../components/project/tabs/ProjectMembers';
import AvatarGroup from '../../components/common/AvatarGroup';
import NormalText from '../../components/common/NormalText';
import { ProjectMemberRole } from '../../models/projects.model';

interface ProjectPageTab {
    id: number;
    title: string;
    component: JSX.Element;
    icon: JSX.Element;
}

const Project: React.FC = ({}) => {
    const { id } = useParams<{ id: string }>();
    const project = useSelector((state: RootState) => projectByIdSelector(state, id));
    const userRole = useSelector((state: RootState) => projectUserRoleSelector(state, id));
    if (!project) return null;

    const [tabs] = useState<ProjectPageTab[]>([
        {
            id: 1,
            title: 'Milestones',
            component: <ProjectMilestones />,
            icon: <TableIcon className="text-gray-700" />,
        },
        {
            id: 2,
            title: 'Project settings',
            component: <ProjectSettings />,
            icon: <CogIcon className="text-gray-700" />,
        },
        {
            id: 3,
            title: 'Members settings',
            component: <ProjectMembers />,
            icon: <UsersIcon className="text-gray-700" />,
        },
    ]);

    return (
        <Screen>
            <div className="flex items-center">
                {project.photoUrl && (
                    <img className="h-12 w-12 ml-0.5 mr-3 rounded-full" src={project.photoUrl} alt={project.name} />
                )}
                <NormalHeader>{project.name}</NormalHeader>
            </div>
            <div className="mt-4 ml-0.5 flex items-center">
                <NormalText className="mr-4 text-bold">Members: </NormalText>{' '}
                <AvatarGroup projectMembers={project.members} />
            </div>
            <div className="w-full  px-2 mt-6 sm:px-0">
                <Tab.Group>
                    <Tab.List className="flex max-w-2xl p-1 space-x-1 bg-gray-100 rounded-xl">
                        {tabs.map((tab) => {
                            if (tab.id === 2 && userRole === ProjectMemberRole.VIEWER) return null;
                            return (
                                <Tab
                                    key={tab.id}
                                    className={({ selected }) =>
                                        classNames(
                                            'w-full py-2.5 text-sm leading-5 font-medium  rounded-lg',
                                            'focus:outline-none ',
                                            selected ? ' bg-white shadow' : 'hover:bg-blue/[0.60] text-gray-700',
                                        )
                                    }
                                >
                                    <div className="flex items-center justify-center">
                                        <div className="w-4 h-4 mr-1.5">{tab.icon}</div>
                                        {tab.title}
                                    </div>
                                </Tab>
                            );
                        })}
                    </Tab.List>
                    <Tab.Panels className="mt-6">
                        {tabs.map((t) => {
                            if (t.id === 2 && userRole === ProjectMemberRole.VIEWER) return null;
                            return (
                                <Tab.Panel key={t.id} className="mt-4 w-full">
                                    {t.component}
                                </Tab.Panel>
                            );
                        })}
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </Screen>
    );
};

export default Project;
