import { Listbox, Transition } from '@headlessui/react';
import { SelectorIcon } from '@heroicons/react/solid';
import React, { Fragment } from 'react';
import { ProjectMemberRole } from '../../models/projects.model';
import NormalText from '../common/NormalText';
import { ProjectBadge } from '../project/ProjectBadge';

interface ProjectRoleSelectorProps {
    selected: ProjectMemberRole;
    onSelected: (role: ProjectMemberRole) => void;
}

const projectMemberRoles = [ProjectMemberRole.EDITOR, ProjectMemberRole.OWNER, ProjectMemberRole.VIEWER];

export const ProjectRoleSelector: React.FC<ProjectRoleSelectorProps> = ({ selected, onSelected }) => {
    return (
        <Listbox value={selected} onChange={onSelected}>
            <div className="relative mt-3 mb-2">
                <NormalText className="mt-5 mb-2 font-medium text-gray-700">Role</NormalText>
                <Listbox.Button className="relative pr-10 text-left bg-white rounded-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                    <span className="block truncate">
                        <ProjectBadge role={selected} />
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute mt-2 pb-2 text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {projectMemberRoles.map((role, roleIdx) => (
                            <Listbox.Option
                                key={roleIdx}
                                className={({ active }) =>
                                    `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
cursor-default select-none relative py-1 px-4 hover:bg-gray-50 cursor-pointer rounded-md`
                                }
                                value={role}
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                            <ProjectBadge role={role} />
                                        </span>
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};
