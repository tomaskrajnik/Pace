import React, { useState } from 'react';
import paceLogo from '../../assets/svg/pace-logo.svg';
import Input from '../../components/form/Input';
import Screen from '../../components/layout/Screen';
import { useForm, Controller } from 'react-hook-form';
import { AuthThunkDispatcher } from '../../store/auth/auth.types';
import * as authThunks from '../../store/auth/auth.thunk';
import { useDispatch } from 'react-redux';
import { SignupData } from '../../services/AuthService.types';
import NormalText from '../../components/common/NormalText';
import { Link } from 'react-router-dom';
import { NonAuthRoutes } from '../../routes/routes.types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import NormalButton from '../../components/common/NormalButton';
import useDocumentTitle from '../../hooks/useDocTitle';

interface IFormInputs {
    name: string;
    email: string;
    password: string;
}

const schema = yup.object().shape({
    name: yup.string().min(2).label('Name').required(),
    email: yup.string().email().label('Email').required(),
    password: yup.string().min(3).label('Password').required(),
});

const Signup: React.FC = () => {
    useDocumentTitle('Pace - Signup');
    const thunkDispatch = useDispatch<AuthThunkDispatcher>();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInputs>({
        defaultValues: { name: '', email: '', password: '' },
        mode: 'onSubmit',
        resolver: yupResolver(schema),
    });

    const [apiError, setApiError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const handleSignup = async (data: SignupData) => {
        try {
            setLoading(true);
            await thunkDispatch(authThunks.signup(data));
        } catch (err: any) {
            setApiError(err.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Screen withoutopPadding>
            <div className="min-h-full flex justify-center py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <img className="mx-auto h-5 w-auto" src={paceLogo} alt="Pace Logo" />
                    <div className="h-100 py-28">
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up</h2>
                        </div>
                        <form className="mt-8 space-y-6" action="#" method="POST">
                            <div className="rounded-md shadow-sm -space-y-px">
                                <input type="hidden" name="remember" value="true" />
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            onChange={onChange}
                                            value={value}
                                            position="top"
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Full Name"
                                            error={errors.name?.message ? true : false}
                                        />
                                    )}
                                />
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            onChange={onChange}
                                            value={value}
                                            position="middle"
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
                                {errors.name?.message ?? errors.email?.message ?? errors.password?.message ?? apiError}
                            </NormalText>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded mr-1"
                                    />
                                    <label htmlFor="remember-me">
                                        <NormalText>Remember me</NormalText>
                                    </label>
                                </div>
                            </div>
                            <NormalButton
                                title="Sign up"
                                loading={loading}
                                icon={{ name: 'LockClosedIcon', position: 'left' }}
                                onClick={handleSubmit(handleSignup)}
                            />
                        </form>

                        <div className="mt-4 text-center flex justify-center">
                            <NormalText className="mr-1">Already have an account? </NormalText>
                            <Link to={NonAuthRoutes.Login}>
                                <NormalText className="text-blue-500 hover:text-blue-600">Log in</NormalText>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Screen>
    );
};

export default Signup;
