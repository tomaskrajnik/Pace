import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NormalButton from '../../components/common/NormalButton';
import NormalHeader from '../../components/common/NormalHeader';
import NormalText from '../../components/common/NormalText';
import Input from '../../components/form/Input';
import { userSelector } from '../../store/auth/auth.selectors';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { User } from '../../models/user.model';
import UserService from '../../services/UserService';
import Screen from '../../components/layout/Screen';
import ProfilePicture from '../../components/common/ProfilePicture';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { useFirebaseStorage } from '../../hooks/firebase/useFirebaseStorage';

interface IFormInputs {
    name: string;
    email: string;
    phoneNumber: string;
    companyName: string;
    jobTitle: string;
    photoUrl: string;
}

const schema = yup.object().shape({
    name: yup.string().min(3).label('Name').required(),
});
const MAX_IMAGES_NUMBER = 1;
const UserSettings: React.FC = ({}) => {
    const user = useSelector(userSelector);
    if (!user) return null;
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState([]);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isDirty },
    } = useForm<IFormInputs>({
        defaultValues: {
            name: user.name ?? '',
            email: user.email ?? '',
            companyName: user.companyName ?? '',
            phoneNumber: user.phoneNumber ?? '',
            jobTitle: user.jobTitle ?? '',
            photoUrl: user.photoUrl ?? '',
        },
        mode: 'onSubmit',
        resolver: yupResolver(schema),
    });

    const { uploadImage, uploading, downloadUrl } = useFirebaseStorage('users', `${user.uid}`);

    const onPhotoChange = (imageList: ImageListType) => {
        setImage(imageList as never[]);
        if (!imageList[0].dataURL) return;
        return uploadImage(imageList[0].dataURL);
    };

    useEffect(() => {
        if (downloadUrl) return setValue('photoUrl', downloadUrl);
    }, [downloadUrl]);

    const handleUpdate = async (data: Partial<User>) => {
        try {
            setLoading(true);
            await UserService.updateUser(user.uid, data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Screen backgroundColorClass="md:bg-gray-100">
            <div className="xs:px-2 ">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <div className="md:px-4 sm:px-0">
                            <NormalHeader>Profile settings</NormalHeader>
                            <NormalText className="mt-2">
                                This information will be displayed publicly so be careful what you share.
                            </NormalText>
                        </div>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form action="#" method="POST">
                            <div className="md:shadow sm:rounded-md sm:overflow-hidden">
                                <div className="md:px-4 py-5 bg-white space-y-6 sm:p-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Photo</label>
                                        <div className="mt-1 flex items-center pt-2">
                                            <ProfilePicture
                                                photoUrl={downloadUrl ?? user.photoUrl}
                                                avatarColor={user.avatarColor}
                                                name={user.name}
                                                size="large"
                                            />
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
                                                            variant="secondary"
                                                            color="blue"
                                                            loading={uploading}
                                                            className=" shadow ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                )}
                                            </ImageUploading>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="col-span-3 sm:col-span-2">
                                            <Controller
                                                name="name"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Input
                                                        onChange={onChange}
                                                        value={value}
                                                        name="name"
                                                        label="Full name"
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
                                        <div className="col-span-3 sm:col-span-2">
                                            <Controller
                                                name="email"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Input
                                                        disabled
                                                        name="email"
                                                        label="Email"
                                                        leftLabel="@"
                                                        position="standalone"
                                                        onChange={onChange}
                                                        value={value}
                                                        id="email"
                                                        type="email"
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-3 sm:col-span-2">
                                            <Controller
                                                name="phoneNumber"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Input
                                                        name="phoneNumber"
                                                        label="Phone number"
                                                        leftLabel="+45"
                                                        position="standalone"
                                                        onChange={onChange}
                                                        value={value}
                                                        id="phoneNumber"
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-3 sm:col-span-2">
                                            <Controller
                                                name="companyName"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Input
                                                        name="companyName"
                                                        label="Company name"
                                                        position="standalone"
                                                        onChange={onChange}
                                                        value={value}
                                                        id="companyName"
                                                        placeholder="e.g. Pace Aps"
                                                        type="text"
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-3 sm:col-span-2">
                                            <Controller
                                                name="jobTitle"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Input
                                                        name="jobTitle"
                                                        label="Job title"
                                                        position="standalone"
                                                        onChange={onChange}
                                                        value={value}
                                                        id="companyName"
                                                        type="text"
                                                        placeholder="e.g. Product manager"
                                                    />
                                                )}
                                            />
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
            </div>
        </Screen>
    );
};

export default UserSettings;
