import React from 'react';
import paceLogo from '../assets/pace-logo.svg';
import Input from '../components/Auth/Input';
import { useForm, Controller } from 'react-hook-form';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import AuthService from '../services/AuthService';
import { useFirebaseAuth } from '../hooks/firebase/useFirebaseAuth';

const Signup: React.FC = () => {
    const fbAuth = useFirebaseAuth();
    // const thunkDispatch = useDispatch<AuthThunkDispatcher>();
    const { control, handleSubmit } = useForm({
        defaultValues: { name: '', email: '', password: '' },
    });
    // const [apiError, setApiError] = useState<string | null>(null);
    const handleSignup = async (data: any) => {
        try {
            const res = await createUserWithEmailAndPassword(fbAuth, data.email, data.password);
            if (res.user) {
                await AuthService.signup(res.user.uid, data.name, data.email);
            }
        } catch (err: any) {
            console.log('errorL:', err);
        }
    };
    return (
        <div className="min-h-full flex items-center justify-center py-48 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <img className="mx-auto h-12 w-auto" src={paceLogo} alt="Pace Logo" />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
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
                                />
                            )}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-red-500 hover:text-red-600">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={handleSubmit(handleSignup)}
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg
                                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="#7F1D1D"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
