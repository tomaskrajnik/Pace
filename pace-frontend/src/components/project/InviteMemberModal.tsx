import React, { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import NormalText from '../common/NormalText';
import * as yup from 'yup';
import NormalButton from '../common/NormalButton';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../form/Input';
import { Project, ProjectMemberRole } from '../../models/projects.model';
import { ProjectRoleSelector } from './tabs/ProjectRoleSelector';
import { InviteProjectMemberRequest } from '../../services/ProjectService.types';
import ProjectService from '../../services/ProjectService';
import { toast } from 'react-toastify';

interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project;
    invitedBy: string;
}

interface IFormInputs {
    email: string;
    role: ProjectMemberRole;
    projectName: string;
    invitedBy: string;
}

const schema = yup.object().shape({
    email: yup.string().email().label('Email').required(),
});

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ onClose, isOpen, project, invitedBy }) => {
    const cancelButtonRef = useRef(null);

    const {
        control,
        handleSubmit,
        reset,
        clearErrors,
        setValue,
        formState: { errors },
    } = useForm<IFormInputs>({
        defaultValues: {
            email: '',
            role: ProjectMemberRole.EDITOR,
            projectName: project.name,
            invitedBy: invitedBy,
        },
        mode: 'onSubmit',
        resolver: yupResolver(schema),
    });

    const [selected, setSelected] = useState(ProjectMemberRole.EDITOR);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setValue('role', selected);
    }, [selected]);

    const handleInvite = async (data: InviteProjectMemberRequest) => {
        try {
            setLoading(true);
            await ProjectService.inviteMember(project.uid, data);
            toast.success('Invitation sent');
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed z-50 inset-0" initialFocus={cancelButtonRef} onClose={onClose}>
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
                        <div className="inline-block align-bottom bg-white rounded-lg text-left  shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-lg">
                                <NormalText className="text-lg">Invite collaborator</NormalText>
                                <div className="col-span-3 mt-3 sm:col-span-2">
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Input
                                                onChange={onChange}
                                                value={value}
                                                name="email"
                                                leftLabel="@"
                                                label="Email"
                                                position="standalone"
                                                id="email"
                                                type="email"
                                                error={errors.email?.message ? true : false}
                                            />
                                        )}
                                    />
                                    <NormalText className="text-red-500 mt-1">{errors.email?.message}</NormalText>
                                </div>

                                <ProjectRoleSelector selected={selected} onSelected={setSelected} />
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
                                        title="Invite"
                                        variant="primary"
                                        onClick={handleSubmit(handleInvite)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};
