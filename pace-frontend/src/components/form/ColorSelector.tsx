import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { PaceColorsEnum } from '../../utils/colors';

interface ColorSelectorProps {
    selected: string;
    onSelected: (val: string) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({ selected, onSelected }) => {
    return (
        <Listbox value={selected} onChange={onSelected}>
            <div className="relative">
                <Listbox.Button className="relative mt-1 rounded cursor-pointer">
                    <div style={{ backgroundColor: selected }} className="w-6 h-6 rounded-md mr-2"></div>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute grid grid-cols-5 gap-x-8 gap-y-2 z-50 mt-2 p-2 pr-8 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {Object.values(PaceColorsEnum).map((color, colorIdx) => {
                            return (
                                <Listbox.Option
                                    key={colorIdx}
                                    className={({ active }) =>
                                        `${active ? 'border-red-500' : ''} cursor-pointer w-6 h-6 rounded-md float-left`
                                    }
                                    value={color}
                                    style={{ backgroundColor: color }}
                                >
                                    {({ selected }) => (
                                        <>
                                            <div
                                                className={`${selected ? 'border-red-500' : ''} w-6 h-6 rounded-md`}
                                                style={{ backgroundColor: color }}
                                            ></div>
                                        </>
                                    )}
                                </Listbox.Option>
                            );
                        })}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};
