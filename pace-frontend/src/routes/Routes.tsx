import React, { useEffect } from 'react';
import { Switch } from 'react-router';
import Dashboard from '../pages/dashboard/Dashboard';
import AuthRoute from '../components/routes/AuthRoute';
import { AuthRoutes, NonAuthRoutes } from './routes.types';
import Signup from '../pages/signup/Signup';
import NonAuthRoute from '../components/routes/NonAuthRoute';
import Login from '../pages/login/Login';
import { isLoggedInSelector } from '../store/auth/auth.selectors';
import { connect } from 'react-redux';
import { RootState } from '../store';
import ResetPassword from '../pages/resetPassword/ResetPassword';
import UserSettings from '../pages/user/UserSettings';
import UserService from '../services/UserService';

const Router: React.FC<ReturnType<typeof mapStateToProps>> = ({ authenticated }) => {
    useEffect(() => {
        if (authenticated) UserService.listenToUserChanges();
    }, [authenticated]);
    return (
        <Switch>
            <>
                <NonAuthRoute authenticated={authenticated} path={NonAuthRoutes.Signup} component={Signup} />
                <NonAuthRoute authenticated={authenticated} path={NonAuthRoutes.Login} component={Login} />
                <NonAuthRoute
                    authenticated={authenticated}
                    path={NonAuthRoutes.ResetPassword}
                    component={ResetPassword}
                />
                <AuthRoute authenticated={authenticated} path={AuthRoutes.Dashboard} component={Dashboard} />
                <AuthRoute authenticated={authenticated} path={AuthRoutes.UserSettings} component={UserSettings} />
            </>
        </Switch>
    );
};

const mapStateToProps = (state: RootState) => ({
    authenticated: isLoggedInSelector(state),
});

export default connect(mapStateToProps)(Router);
