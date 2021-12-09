import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import NormalText from '../common/NormalText';
import * as yup from 'yup';
import NormalButton from '../common/NormalButton';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../form/Input';
import { useFirebaseStorage } from '../../hooks/firebase/useFirebaseStorage';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { nanoid } from 'nanoid';
import { PhotographIcon } from '@heroicons/react/solid';
import { CreateProjectRequest } from '../../services/ProjectService.types';
import ProjectService from '../../services/ProjectService';
import { toast } from 'react-toastify';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface IFormInputs {
    name: string;
    photoUrl: string;
}

const schema = yup.object().shape({
    name: yup.string().min(3).max(25).label('Name').required(),
});
const MAX_IMAGES_NUMBER = 1;
export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, isOpen }) => {
    const cancelButtonRef = useRef(null);

    const [image, setImage] = useState([]);
    const [loading, setLoading] = useState(false);
    const {
        control,
        handleSubmit,
        setValue,
        reset,
        clearErrors,
        formState: { errors },
    } = useForm<IFormInputs>({
        defaultValues: {
            name: '',
            photoUrl: '',
        },
        mode: 'onSubmit',
        resolver: yupResolver(schema),
    });

    const { uploadImage, uploading, downloadUrl } = useFirebaseStorage('projects', nanoid());

    const onPhotoChange = (imageList: ImageListType) => {
        setImage(imageList as never[]);
        if (!imageList[0].dataURL) return;
        return uploadImage(imageList[0].dataURL);
    };

    useEffect(() => {
        if (downloadUrl) return setValue('photoUrl', downloadUrl);
    }, [downloadUrl]);

    const handleProjectCreate = async (data: CreateProjectRequest) => {
        try {
            setLoading(true);
            await ProjectService.createProject(data);
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-50 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                onClose={onClose}
            >
                <div className="flex p-0 items-end justify-center min-h-screen sm:pt-4 sm:px-4 sm:pb-20 text-center sm:block ">
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
                        <div className="w-full absolute bottom-0 pb-0 sm:relative align-bottom flex flex-col sm:inline-block mt-64 sm:mt-0 bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:align-middle ">
                            <div className="bg-white mb-16 sm:mb-0 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <NormalText className="text-lg">Create project</NormalText>
                                <div className="col-span-3 mt-3 sm:col-span-2">
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Input
                                                onChange={onChange}
                                                value={value}
                                                name="name"
                                                label="Project name"
                                                position="standalone"
                                                id="name"
                                                type="text"
                                                error={errors.name?.message ? true : false}
                                            />
                                        )}
                                    />
                                    <NormalText className="text-red-500 mt-1">{errors.name?.message}</NormalText>
                                </div>
                                <NormalText className="mt-5 font-medium text-gray-700">Project photo</NormalText>
                                <div className="mt-1 flex items-center pt-2">
                                    {downloadUrl ? (
                                        <img className="h-12 w-12 rounded-full" src={downloadUrl} alt="" />
                                    ) : (
                                        <div className="w-12 h-12 p-3 rounded-full bg-gray-100">
                                            <PhotographIcon className="text-blue-500" />
                                        </div>
                                    )}
                                    <ImageUploading
                                        multiple
                                        value={image}
                                        onChange={onPhotoChange}
                                        maxNumber={MAX_IMAGES_NUMBER}
                                    >
                                        {({ onImageUpload }) => (
                                            <div className="w-40">
                                                <NormalButton
                                                    title="Upload photo"
                                                    onClick={onImageUpload}
                                                    variant="tertiary"
                                                    color="blue"
                                                    loading={uploading}
                                                    className=" shadow ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                />
                                            </div>
                                        )}
                                    </ImageUploading>
                                </div>
                            </div>
                            <div className="sm:bg-gray-50 mt-24 sm:mt-0 mt-auto align-bottom px-4 py-3 sm:px-6 flex justify-end">
                                <div className="flex flex-row w-60 sm:self-end">
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
                                        disabled={uploading}
                                        title="Create"
                                        variant="primary"
                                        onClick={handleSubmit(handleProjectCreate)}
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
