import { Listbox, Transition } from '@headlessui/react';
import { SelectorIcon } from '@heroicons/react/solid';
import React, { Fragment } from 'react';
import { SubtaskMember } from '../../models/subtasks.model';
import NormalText from '../common/NormalText';
import { SubtaskAssignee } from '../subtasks/SubtaskAssignee';

interface AssigneeSelectorProps {
    selected: SubtaskMember | null;
    onSelected: (assignee: SubtaskMember | null) => void;
    members: SubtaskMember[];
    type?: 'minimal' | 'expanded';
}

export const AssigneeSelector: React.FC<AssigneeSelectorProps> = ({
    selected,
    onSelected,
    members,
    type = 'expanded',
}) => {
    if (type === 'expanded')
        return (
            <Listbox value={selected} onChange={onSelected}>
                <div className="relative mt-1 mb-3">
                    <NormalText className="mt-2 mb-2 font-medium text-gray-700">Assignee:</NormalText>
                    <Listbox.Button className="relative pr-10 text-left bg-white rounded-lg cursor-pointer items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 hover:bg-gray-100 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                        <span className="block truncate">
                            <SubtaskAssignee size="small" member={selected} />
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
                        <Listbox.Options
                            className={`absolute bg-white  z-50 mt-2 pb-2 text-base rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}
                        >
                            <Listbox.Option
                                key="unassigned"
                                className={({ active }) =>
                                    `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
cursor-default select-none relative py-1 px-4 hover:bg-gray-50 cursor-pointer rounded-md`
                                }
                                value={null}
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                            <SubtaskAssignee member={null} />
                                        </span>
                                    </>
                                )}
                            </Listbox.Option>
                            {members.map((member, meberIdx) => (
                                <Listbox.Option
                                    key={meberIdx}
                                    className={({ active }) =>
                                        `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
cursor-default select-none relative py-1 px-4 hover:bg-gray-50 cursor-pointer rounded-md`
                                    }
                                    value={member}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}
                                            >
                                                <SubtaskAssignee member={member} />
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
    return (
        <Listbox value={selected} onChange={onSelected}>
            <div className="relative">
                <Listbox.Button className="relative pr-10 text-left rounded-lg cursor-pointer items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 hover:bg-gray-100 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                    <span className="block truncate">
                        <SubtaskAssignee size="small" hideName member={selected} />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options
                        className={`absolute bg-white z-50 mt-2 pb-2 text-base rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}
                    >
                        <Listbox.Option
                            key="unassigned"
                            className={({ active }) =>
                                `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
cursor-default select-none relative py-1 px-4 hover:bg-gray-50 cursor-pointer rounded-md`
                            }
                            value={null}
                        >
                            {({ selected }) => (
                                <>
                                    <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                        <SubtaskAssignee member={null} />
                                    </span>
                                </>
                            )}
                        </Listbox.Option>
                        {members.map((member, meberIdx) => (
                            <Listbox.Option
                                key={meberIdx}
                                className={({ active }) =>
                                    `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
cursor-default select-none relative py-1 px-4 hover:bg-gray-50 cursor-pointer rounded-md`
                                }
                                value={member}
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                            <SubtaskAssignee member={member} />
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
