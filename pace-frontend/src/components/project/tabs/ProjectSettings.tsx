import React, { useCallback, useEffect, useState } from 'react';
import NormalText from '../../common/NormalText';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { projectByIdSelector, projectUserRoleSelector } from '../../../store/projects/projects.selectors';
import { useParams } from 'react-router-dom';
import { useFirebaseStorage } from '../../../hooks/firebase/useFirebaseStorage';
import { nanoid } from 'nanoid';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import Input from '../../form/Input';
import NormalButton from '../../common/NormalButton';
import { toast } from 'react-toastify';
import { Project, ProjectMemberRole } from '../../../models/projects.model';
import { PhotographIcon } from '@heroicons/react/solid';
import { WarningPopUp } from '../../layout/WarningPopUp';
import ProjectService from '../../../services/ProjectService';
import { AuthRoutes } from '../../../routes/routes.types';
interface IFormInputs {
    name: string;
    photoUrl: string;
}

const schema = yup.object().shape({
    name: yup.string().min(3).label('Name').required(),
});
const MAX_IMAGES_NUMBER = 1;

const ProjectSettings: React.FC = ({}) => {
    const { id: projectId } = useParams<{ id: string }>();
    const project = useSelector((state: RootState) => projectByIdSelector(state, projectId));
    const userRole = useSelector((state: RootState) => projectUserRoleSelector(state, projectId));
    const [loading, setLoading] = useState(false);
    const [leavePopUpOpen, setLeavePopUpOpen] = useState(false);
    const [leaveButtonLoading, setLeaveButtonLoading] = useState(false);
    const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);
    const [deletePopUpOpen, setDeletePopUpOpen] = useState(false);
    const [image, setImage] = useState([]);
    if (!project) return null;

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isDirty },
    } = useForm<IFormInputs>({
        defaultValues: {
            name: project.name ?? '',
            photoUrl: project.photoUrl ?? '',
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

    const handleUpdate = async (data: Partial<Project>) => {
        console.log(data);
        try {
            setLoading(true);
            await ProjectService.updateProject(projectId, data);
            toast.success('Update successfull');
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const onLeaveProject = async () => {
        try {
            setLeaveButtonLoading(true);
            await ProjectService.leaveProject(projectId);
            toast.success('Success');
            document.location.href = AuthRoutes.Dashboard;
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLeaveButtonLoading(false);
            setLeavePopUpOpen(false);
        }
    };

    const onDeleteProject = async () => {
        if (userRole !== ProjectMemberRole.OWNER) return;
        try {
            setDeleteButtonLoading(true);
            await ProjectService.deleteProject(projectId);
            toast.success('Project deleted');
            document.location.href = AuthRoutes.Dashboard;
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setDeleteButtonLoading(false);
            setDeletePopUpOpen(false);
        }
    };

    const Photo = useCallback(() => {
        if (downloadUrl) return <img className="h-16 w-16 rounded-full" src={downloadUrl} alt="" />;
        if (project.photoUrl?.length) return <img className="h-16 w-16 rounded-full" src={project.photoUrl} alt="" />;
        return (
            <div className="w-16 h-16 p-3 rounded-full bg-gray-100">
                <PhotographIcon className="text-blue-500" />
            </div>
        );
    }, [downloadUrl, project.photoUrl]);

    return (
        <>
            <div>
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <div className="sm:px-0">
                            <NormalText className="text-xl">Project settings</NormalText>
                            <NormalText className="mt-2">
                                This information will be displayed publicly so be careful what you share.
                            </NormalText>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <div className="shadow mt-4 sm:mt-0 overflow-hidden bg-white border border-gray-200 rounded-lg">
                            <div className="p-4 sm:p-2">
                                <form action="#" method="POST">
                                    <div>
                                        <div className="md:px-4 sm:py-5 bg-white space-y-6 sm:p-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Photo</label>
                                                <div className="mt-1 flex items-center pt-2">
                                                    <Photo />
                                                    <ImageUploading
                                                        multiple
                                                        value={image}
                                                        onChange={onPhotoChange}
                                                        maxNumber={MAX_IMAGES_NUMBER}
                                                    >
                                                        {({ onImageUpload }) => (
                                                            <div className="w-40">
                                                                <NormalButton
                                                                    title="Change photo"
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
                                            <div className="sm:grid sm:grid-cols-3 gap-6">
                                                <div className="sm:col-span-2s sm:col-span-2">
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
                                                    <NormalText className="text-red-500 mt-1">
                                                        {errors.name?.message}
                                                    </NormalText>
                                                </div>
                                            </div>

                                            <div className="w-40">
                                                <NormalButton
                                                    disabled={!isDirty && !downloadUrl}
                                                    loading={loading}
                                                    className="shadow"
                                                    title="Save"
                                                    onClick={handleSubmit(handleUpdate)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <NormalText className="mt-8 text-lg">Danger zone</NormalText>
                        <div className="shadow md:col-span-2 mt-4 overflow-hidden bg-white border border-red-200 rounded-lg">
                            <div className=" flex-col sm:flex-row sm:justify-between px-4 py-4">
                                <div>
                                    <NormalText className="font-bold text-red-500">Leave project</NormalText>
                                    <NormalText>
                                        If a ownner leaves the project. The whole project will be deleted
                                    </NormalText>
                                </div>
                                <div className="inline-block mt-2 sm:mt-0 w-30">
                                    <NormalButton
                                        className="shadow"
                                        title="Leave Project"
                                        color="red"
                                        onClick={() => setLeavePopUpOpen(true)}
                                    />
                                </div>
                            </div>
                            <div className="flex-col sm:flex-row justify-between px-4 border-t border-red-200 py-4">
                                <div>
                                    <NormalText className="font-bold text-red-500">Delete project</NormalText>
                                    <NormalText>
                                        Once you delete a project, there is no going back. Please be certain.
                                    </NormalText>
                                </div>
                                <div className="inline-block mt-2 sm:mt-0 w-30">
                                    <NormalButton
                                        disabled={userRole === ProjectMemberRole.EDITOR}
                                        className="shadow"
                                        title="Delete Project"
                                        color="red"
                                        onClick={() => setDeletePopUpOpen(true)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <WarningPopUp
                loading={leaveButtonLoading}
                isOpen={leavePopUpOpen}
                action="Leave"
                onAction={onLeaveProject}
                header="Are you sure to leave this project?"
                text="You will have to be invited again"
                onClose={() => setLeavePopUpOpen(false)}
            />
            <WarningPopUp
                loading={deleteButtonLoading}
                isOpen={deletePopUpOpen}
                action="Delete project"
                onAction={onDeleteProject}
                header="Are you sure to delete this project?"
                text="Once you delete a project, there is no going back. Please be certain."
                onClose={() => setDeletePopUpOpen(false)}
            />
        </>
    );
};

export default ProjectSettings;
