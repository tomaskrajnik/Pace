import React from 'react';
import { Switch } from 'react-router';
import Dashboard from '../pages/Dashboard';
import AuthRoute from '../components/routes/AuthRoute';
import { AuthRoutes, NonAuthRoutes } from './routes.types';
import Signup from '../pages/Signup';
import NonAuthRoute from '../components/routes/NonAuthRoute';
import Login from '../pages/Signin';

interface RouterProps {
    authenticated: boolean;
}

const Router: React.FC<RouterProps> = ({ authenticated }) => {
    return (
        <Switch>
            <>
                <NonAuthRoute authenticated={authenticated} path={NonAuthRoutes.Signup} component={Signup} />
                <NonAuthRoute authenticated={authenticated} path={NonAuthRoutes.Login} component={Login} />
                <AuthRoute authenticated={authenticated} path={AuthRoutes.Dashboard} component={Dashboard} />
            </>
        </Switch>
    );
};

export default Router;
