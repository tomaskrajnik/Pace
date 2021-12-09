import React from 'react';
import paceLogo from '../../assets/svg/pace-logo.svg';

import Screen from '../../components/layout/Screen';
import { Link } from 'react-router-dom';
import NormalText from '../../components/common/NormalText';
import { AuthRoutes } from '../../routes/routes.types';

const Login: React.FC = () => {
    return (
        <Screen withoutopPadding>
            <div className="min-h-full flex justify-center py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <img className="mx-auto h-5 w-auto" src={paceLogo} alt="Pace Logo" />
                    <div className="h-100 py-28">
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                <span className="text-blue-500"> 404.</span> The page you are looking for was not found
                            </h2>
                        </div>

                        <div className="mt-4 text-center flex justify-center">
                            <Link to={AuthRoutes.Dashboard}>
                                <NormalText className="text-blue-500 hover:text-blue-600"> Go to homepage</NormalText>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Screen>
    );
};

export default Login;
