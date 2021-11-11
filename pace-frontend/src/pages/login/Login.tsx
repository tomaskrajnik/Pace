import React, { useState } from 'react';
import paceLogo from '../../assets/svg/pace-logo.svg';
import Input from '../../components/auth/Input';
import { useForm, Controller } from 'react-hook-form';
import { AuthThunkDispatcher } from '../../store/auth/auth.types';
import * as authThunks from '../../store/auth/auth.thunk';
import { useDispatch } from 'react-redux';
import { LoginData } from '../../services/AuthService.types';
import Screen from '../../components/layout/Screen';
import { Link } from 'react-router-dom';
import NormalText from '../../components/common/NormalText';
import { NonAuthRoutes } from '../../routes/routes.types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import NormalButton from '../../components/common/NormalButton';

interface IFormInputs {
    email: string;
    password: string;
}

const schema = yup.object().shape({
    email: yup.string().email().label('Email').required(),
    password: yup.string().min(3).label('Password').required(),
});

const Login: React.FC = () => {
    const thunkDispatch = useDispatch<AuthThunkDispatcher>();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInputs>({
        defaultValues: { email: '', password: '' },
        mode: 'onSubmit',
        resolver: yupResolver(schema),
    });
    const [apiError, setApiError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const handleLogin = async (data: LoginData) => {
        try {
            setLoading(true);
            await thunkDispatch(authThunks.login(data));
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
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome back!</h2>
                        </div>
                        <form className="mt-8 space-y-6" action="#" method="POST">
                            <div className="rounded-md shadow-sm -space-y-px">
                                <input type="hidden" name="remember" value="true" />
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            onChange={onChange}
                                            value={value}
                                            position="top"
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="Email"
                                            error={errors.email?.message ? true : false}
                                        />
                                    )}
                                />
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            onChange={onChange}
                                            value={value}
                                            position="bottom"
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            placeholder="Password"
                                            error={errors.password?.message ? true : false}
                                        />
                                    )}
                                />
                            </div>

                            <NormalText className="text-red-500">
                                {errors.email?.message ?? errors.password?.message ?? apiError}
                            </NormalText>

                            <div className="flex items-center justify-between">
                                <Link to={NonAuthRoutes.ResetPassword}>
                                    <NormalText className="text-blue-500 hover:text-blue-600">
                                        Forgot your password?
                                    </NormalText>
                                </Link>
                            </div>

                            <div>
                                <NormalButton
                                    title="Log in"
                                    loading={loading}
                                    icon={{ name: 'LockClosedIcon', position: 'left' }}
                                    onClick={handleSubmit(handleLogin)}
                                />
                            </div>
                        </form>
                        <div className="mt-4 text-center flex justify-center">
                            <NormalText>Don&apos;t have an account yet? </NormalText>
                            <Link to={NonAuthRoutes.Signup}>
                                <NormalText className="text-blue-500 hover:text-blue-600">Sign up</NormalText>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Screen>
    );
};

export default Login;
