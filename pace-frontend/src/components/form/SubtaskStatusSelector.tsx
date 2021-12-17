import { Listbox, Transition } from '@headlessui/react';
import { SelectorIcon } from '@heroicons/react/solid';
import React, { Fragment } from 'react';
import { SubtasksStatus } from '../../models/subtasks.model';
import NormalText from '../common/NormalText';
import { SubtaskStatusBadge } from '../subtasks/SubtaskStatusBadge';

interface SubtaskStatusSelectorProps {
    selected: SubtasksStatus;
    onSelected: (status: SubtasksStatus) => void;
    type?: 'minimal' | 'expanded';
}

const subtaskStatuses = [SubtasksStatus.Done, SubtasksStatus.InProgress, SubtasksStatus.ToDo];

export const SubtaskStatusSelector: React.FC<SubtaskStatusSelectorProps> = ({
    selected,
    onSelected,
    type = 'expanded',
}) => {
    if (type === 'expanded')
        return (
            <Listbox value={selected} onChange={onSelected}>
                <div className="relative  mt-1 mb-3">
                    <NormalText className="mt-2 mb-2 font-medium text-gray-700">Status</NormalText>
                    <Listbox.Button className="relative pr-10 text-left bg-white rounded-lg cursor-pointer items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                        <span className="block truncate">
                            <SubtaskStatusBadge status={selected} />
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <SelectorIcon className="w-5 h-5 mt-2 text-gray-400" aria-hidden="true" />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute z-50 mt-2 pb-2 text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {subtaskStatuses.map((status, statusIdx) => (
                                <Listbox.Option
                                    key={statusIdx}
                                    className={({ active }) =>
                                        `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
cursor-default select-none relative py-1 px-4 hover:bg-gray-50 cursor-pointer rounded-md`
                                    }
                                    value={status}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}
                                            >
                                                <SubtaskStatusBadge status={status} />
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
                <Listbox.Button className="relative text-left rounded-lg cursor-pointer items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                    <span className="block truncate">
                        <SubtaskStatusBadge status={selected} />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-50 right-0 text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {subtaskStatuses.map((status, statusIdx) => (
                            <Listbox.Option
                                key={statusIdx}
                                className={({ active }) =>
                                    `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
cursor-default select-none relative py-1 px-4 hover:bg-gray-50 cursor-pointer rounded-md`
                                }
                                value={status}
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                            <SubtaskStatusBadge status={status} />
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
