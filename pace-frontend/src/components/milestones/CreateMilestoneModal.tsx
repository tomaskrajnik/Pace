import React, { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import NormalText from '../common/NormalText';
import * as yup from 'yup';
import NormalButton from '../common/NormalButton';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../form/Input';
import { toast } from 'react-toastify';
import { PaceColorsEnum } from '../../utils/colors';
import { CustomDatePicker } from '../../components/form/CustomDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { ColorSelector } from '../form/ColorSelector';
import { Milestone } from '../../models/milestones.model';
import { useDispatch, useSelector } from 'react-redux';
import { milestonesSelector } from '../../store/milestones/milestones.selector';
import { setMilestones } from '../../store/milestones/milestones.actions';
import { nanoid } from 'nanoid';

interface CreateMilestoneModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface IFormInputs {
    name: string;
    description: string;
}

const schema = yup.object().shape({
    name: yup.string().min(3).max(25).label('Milestone name').required(),
});

export const CreateMilestoneModal: React.FC<CreateMilestoneModalProps> = ({ onClose, isOpen }) => {
    const cancelButtonRef = useRef(null);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState<string | PaceColorsEnum>(PaceColorsEnum.BLUE_400);
    const milestones = useSelector(milestonesSelector);
    const dispatch = useDispatch();
    const {
        control,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors },
    } = useForm<IFormInputs>({
        defaultValues: {
            name: '',
            description: '',
        },
        mode: 'onSubmit',
        resolver: yupResolver(schema),
    });

    const handleMilestoneCreate = async (data: { name: string; description: string }) => {
        if (!milestones) return;
        const milestone: Milestone = {
            uid: nanoid(),
            ...data,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            color,
            subtasks: [],
            createdAt: Date.now(),
        };

        try {
            setLoading(true);
            dispatch(setMilestones([...milestones, milestone]));
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            onClose();
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog as="div" className="fixed z-50 inset-0 h-100" initialFocus={cancelButtonRef} onClose={onClose}>
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white rounded-lg px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="flex items-center">
                                        <ColorSelector selected={color} onSelected={(col) => setColor(col)} />
                                        <NormalText className="text-lg">Create milestone</NormalText>
                                    </div>
                                    <div className="col-span-3 mt-3 sm:col-span-2">
                                        <Controller
                                            name="name"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Input
                                                    onChange={onChange}
                                                    value={value}
                                                    name="name"
                                                    label="Milestone name"
                                                    position="standalone"
                                                    id="name"
                                                    type="text"
                                                    error={errors.name?.message ? true : false}
                                                />
                                            )}
                                        />
                                        <NormalText className="text-red-500 mt-1">{errors.name?.message}</NormalText>
                                    </div>
                                    <div className="col-span-3 justify-between flex mt-3 sm:col-span-2">
                                        <div>
                                            <NormalText>Start date:</NormalText>
                                            <DatePicker
                                                dateFormat="dd/MM/yyyy"
                                                selected={startDate}
                                                onChange={(date: Date | null) => date && setStartDate(date)}
                                                customInput={React.createElement(React.forwardRef(CustomDatePicker))}
                                            />
                                        </div>
                                        <div>
                                            <NormalText>End date:</NormalText>
                                            <DatePicker
                                                dateFormat="dd/MM/yyyy"
                                                selected={endDate}
                                                onChange={(date: Date | null) => date && setEndDate(date)}
                                                customInput={React.createElement(React.forwardRef(CustomDatePicker))}
                                                minDate={endDate}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-3 mt-3 sm:col-span-2">
                                        <NormalText>Description:</NormalText>
                                        <Controller
                                            name="name"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <textarea
                                                    onChange={onChange}
                                                    value={value}
                                                    id="description"
                                                    name="description"
                                                    rows={3}
                                                    className="shadow-sm mt-2 focus:ring-indigo-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                    placeholder="Short description"
                                                    defaultValue={''}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 rounded-b-lg sm:px-6 flex justify-end">
                                    <div className="sm:flex sm:flex-row w-60 self-end">
                                        <NormalButton
                                            className="mr-2"
                                            title="Cancel"
                                            variant="secondary"
                                            onClick={() => {
                                                clearErrors();
                                                reset();
                                                onClose();
                                            }}
                                        />
                                        <NormalButton
                                            loading={loading}
                                            title="Create"
                                            variant="primary"
                                            onClick={handleSubmit(handleMilestoneCreate)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </LocalizationProvider>
    );
};
