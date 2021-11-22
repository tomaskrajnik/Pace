import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Project, ProjectMember, ProjectMemberRole } from '../../models/projects.model';
import ProjectService from '../../services/ProjectService';
import NormalButton from '../common/NormalButton';
import NormalText from '../common/NormalText';
import { ProjectRoleSelector } from '../form/ProjectRoleSelector';

interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project;
    member: ProjectMember | null;
}

export const UpdateMemberRoleModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose, project, member }) => {
    const cancelButtonRef = useRef(null);
    const [selected, setSelected] = useState(ProjectMemberRole.EDITOR);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (member) setSelected(member.role);
    }, [member]);

    if (!member) return null;

    const handleUpdateRole = async () => {
        const membersClone = [...project.members];
        membersClone.forEach((m) => {
            if (m.uid === member.uid) return (m.role = selected);
        });
        try {
            setLoading(true);
            await ProjectService.updateProject(project.uid, { members: membersClone });
            toast.success('Success');
        } catch (err) {
            toast.error('Something went wrong');
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
                                <NormalText className="text-lg">{`Change user role for ${member.name}`}</NormalText>

                                <ProjectRoleSelector selected={selected} onSelected={setSelected} />
                            </div>
                            <div className="bg-gray-50 px-4 py-3 rounded-b-lg sm:px-6 flex justify-end">
                                <div className="sm:flex sm:flex-row w-60 self-end">
                                    <NormalButton
                                        className="mr-2"
                                        title="Cancel"
                                        variant="secondary"
                                        onClick={() => {
                                            onClose();
                                        }}
                                    />
                                    <NormalButton
                                        loading={loading}
                                        disabled={selected === member.role}
                                        title="Save"
                                        variant="primary"
                                        onClick={handleUpdateRole}
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
