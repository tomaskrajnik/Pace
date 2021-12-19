import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import NormalText from '../common/NormalText';
import * as yup from 'yup';
import NormalButton from '../common/NormalButton';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../form/Input';
import { Subtask, SubtaskMember, SubtasksStatus } from '../../models/subtasks.model';
import { SubtaskStatusSelector } from '../form/SubtaskStatusSelector';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../store';
import { projectByIdSelector } from '../../store/projects/projects.selectors';
import { AssigneeSelector } from '../form/AssigneeSelector';
import { useSubtaskActions } from '../../hooks/useSubtaskActions';
import { TrashIcon, CheckCircleIcon } from '@heroicons/react/solid';
import moment from 'moment';
import { SubtaskAssignee } from './SubtaskAssignee';
import useOnClickOutside from '../../hooks/useHandleClickOutside';
import { UpdateSubtasktRequest } from '../../services/SubtasksService.types';
import { WarningPopUp } from '../layout/WarningPopUp';

interface PreviewSubtaskModalProps {
    subtaskToPreview: Subtask | null;
    onClose: () => void;
    milestoneId: string;
}

interface IFormInputs {
    name: string;
    description: string;
    milestoneId: string;
}

const schema = yup.object().shape({
    name: yup.string().min(3).max(25).label('Milestone name').required(),
});

export const PreviewSubtaskModal: React.FC<PreviewSubtaskModalProps> = ({
    onClose,
    subtaskToPreview: s,
    milestoneId,
}) => {
    const cancelButtonRef = useRef(null);
    const { projectId } = useParams<{ projectId: string }>();
    const project = useSelector((state: RootState) => projectByIdSelector(state, projectId));
    const [selectedStatus, setSelectedStatus] = useState(SubtasksStatus.ToDo);
    const [selectedAssignee, setSelectedAssignee] = useState<SubtaskMember | null>(null);
    const [titleInputOpened, setTitleInputOpened] = useState(false);
    const [descriptionInputOpened, setDescriptionInputOpened] = useState(false);
    const [warningPopUpOpened, setWarningPopUpOpened] = useState(false);

    const { loading, updateSubtask, deleteSubtask } = useSubtaskActions();

    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const renderIcon = useCallback(() => {
        if (!s) return;
        switch (s.status) {
            case SubtasksStatus.Done:
                return <CheckCircleIcon className="w-5 h-5 mr-1 text-green-400" />;
            case SubtasksStatus.InProgress:
                return <CheckCircleIcon className="w-5 h-5 mr-1 text-yellow-400" />;
            case SubtasksStatus.ToDo:
                return <CheckCircleIcon className="w-5 h-5 mr-1 text-gray-400" />;
        }
    }, [s]);

    const handleClickOutside = () => {
        setTitleInputOpened(false);
        setDescriptionInputOpened(false);
    };

    useOnClickOutside([titleRef, descriptionRef], handleClickOutside);

    const subtaskMembers: SubtaskMember[] = useMemo(
        //@ts-ignore
        () => project.members.map(({ role, ...m }) => m),
        [project.members],
    );

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors, isDirty },
    } = useForm<IFormInputs>({
        defaultValues: {
            name: '',
            description: '',
            milestoneId: milestoneId,
        },
        mode: 'onSubmit',
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (s?.name) setValue('name', s.name);
        if (s?.description) setValue('description', s.description);
        if (s?.assignee) setSelectedAssignee(s.assignee);
        if (s?.status) setSelectedStatus(s.status);

        return () => {
            reset();
            setSelectedAssignee(null);
        };
    }, [s]);

    if (!s) return null;

    const handleSubtaskUpdate = async (data: UpdateSubtasktRequest) => {
        if (!s) return;
        await updateSubtask(s.uid, data);
    };

    const handleStatusChange = async (status: SubtasksStatus) => {
        setSelectedStatus(status);
        await updateSubtask(s.uid, { status }, () => null, true);
    };

    const handleAssigneeChange = async (assignee: SubtaskMember | null) => {
        setSelectedAssignee(assignee);
        await updateSubtask(s.uid, { assignee: assignee ?? 'unassigned' }, () => null, true);
    };

    return (
        <Transition.Root show={s ? true : false} as={Fragment}>
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
                        <div className="w-full absolute bottom-0 pb-0 sm:relative align-bottom flex flex-col sm:inline-block mt-64 sm:mt-0 bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:max-w-xl sm:align-middle">
                            <div className="bg-white flex flex-row rounded-lg px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="w-full">
                                    <div className="flex flex-row items-center">
                                        {renderIcon()}
                                        {titleInputOpened ? (
                                            <div ref={titleRef}>
                                                <Controller
                                                    name="name"
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <Input
                                                            onChange={onChange}
                                                            value={value}
                                                            name="name"
                                                            position="standalone"
                                                            id="name"
                                                            type="text"
                                                            error={errors.name?.message ? true : false}
                                                        />
                                                    )}
                                                />
                                                <NormalText className="text-red-500 mt-1">
                                                    {errors.name?.message}
                                                </NormalText>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => setTitleInputOpened(true)}
                                                className="hover:bg-gray-100 py-1 px-2"
                                            >
                                                <NormalText className="text-lg ">{getValues('name')}</NormalText>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <SubtaskStatusSelector
                                            selected={selectedStatus}
                                            onSelected={handleStatusChange}
                                        />
                                        <AssigneeSelector
                                            members={subtaskMembers}
                                            selected={selectedAssignee}
                                            onSelected={handleAssigneeChange}
                                        />
                                    </div>
                                    <div className="col-span-3 mt-3 sm:col-span-2">
                                        <NormalText className="font-medium text-gray-700">Description:</NormalText>
                                        {descriptionInputOpened ? (
                                            <div ref={descriptionRef}>
                                                <Controller
                                                    name="description"
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <textarea
                                                            onChange={onChange}
                                                            value={value}
                                                            id="description"
                                                            name="description"
                                                            rows={3}
                                                            className="shadow-sm mt-2 focus:ring-indigo-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="mt-2 py-1 px-1 hover:bg-gray-100 w-full rounded h-24"
                                                onClick={() => setDescriptionInputOpened(true)}
                                            >
                                                <NormalText>{`${
                                                    getValues('description')
                                                        ? getValues('description')
                                                        : 'No description'
                                                }`}</NormalText>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full flex justify-center">
                                    <div className="mt-12 ">
                                        <div>
                                            <NormalText className="font-medium text-gray-700">Created at:</NormalText>
                                            <NormalText>
                                                {moment(new Date(s.createdAt)).format('MM.DD.YYYY')}
                                            </NormalText>
                                        </div>
                                        <div>
                                            <NormalText className="font-medium text-gray-700 mt-4">
                                                Reporter:
                                            </NormalText>
                                            <SubtaskAssignee member={s.reporter} />
                                        </div>
                                        <div className="mt-4">
                                            <button
                                                onClick={() => setWarningPopUpOpened(true)}
                                                className="px-4 py-2 items-center text-sm font-bold text-red-400 rounded-md bg-red-50 hover:bg-red-100 flex"
                                            >
                                                <TrashIcon className="w-4 h-4 text-red-400 mr-1" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {isDirty && (
                                <div className="sm:bg-gray-50 px-4 py-3 rounded-b-lg sm:px-6 flex justify-end">
                                    <div className="flex flex-row w-32 self-end">
                                        <NormalButton
                                            loading={loading}
                                            title="Save"
                                            variant="primary"
                                            onClick={handleSubmit(handleSubtaskUpdate)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Transition.Child>
                </div>
                <WarningPopUp
                    loading={loading}
                    onAction={() =>
                        deleteSubtask(s.uid, () => {
                            setWarningPopUpOpened(false);
                            onClose();
                        })
                    }
                    action="Delete"
                    onClose={() => setWarningPopUpOpened(false)}
                    isOpen={warningPopUpOpened}
                    header="Are you sure you want to delete this subtasks?"
                    text="You may loose progress on the milestone"
                />
            </Dialog>
        </Transition.Root>
    );
};
