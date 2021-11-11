import React, { useState } from 'react';
import paceLogo from '../../assets/svg/pace-logo.svg';
import Input from '../../components/auth/Input';
import { useForm, Controller } from 'react-hook-form';
import Screen from '../../components/layout/Screen';
import NormalText from '../../components/common/NormalText';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AuthService from '../../services/AuthService';
import NormalButton from '../../components/common/NormalButton';

interface IFormInputs {
    email: string;
}

const schema = yup.object().shape({
    email: yup.string().email().label('Email').required(),
});

const ResetPassword: React.FC = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInputs>({
        defaultValues: { email: '' },
        mode: 'onSubmit',
        resolver: yupResolver(schema),
    });
    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const handleLogin = async (data: { email: string }) => {
        try {
            setLoading(true);
            const response = await AuthService.requestPasswordReset(data.email);
            if (response.success) return setApiSuccess(`Email successfully sent to ${data.email}`);
        } catch (err: any) {
            setApiError(err.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Screen>
            <div className="min-h-full flex justify-center py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <img className="mx-auto h-5 w-auto" src={paceLogo} alt="Pace Logo" />
                    <div className="h-100 py-28">
                        <form className="mt-8 space-y-6" action="#" method="POST">
                            <NormalText>We will send a recovery link to:</NormalText>
                            <div className="rounded-md shadow-sm -space-y-px">
                                <input type="hidden" name="remember" value="true" />
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            onChange={onChange}
                                            value={value}
                                            position="standalone"
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="Enter your email"
                                            error={errors.email?.message ? true : false}
                                        />
                                    )}
                                />
                            </div>

                            <NormalText className="text-red-500">{errors.email?.message ?? apiError}</NormalText>
                            {apiSuccess && <NormalText className="text-green-500">{apiSuccess}</NormalText>}
                            <NormalButton
                                title="Send recovery link"
                                icon={{ name: 'ArrowRightIcon', position: 'right' }}
                                onClick={handleSubmit(handleLogin)}
                                loading={loading}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </Screen>
    );
};

export default ResetPassword;
