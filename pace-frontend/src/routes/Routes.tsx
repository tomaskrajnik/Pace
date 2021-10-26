import React from 'react';
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

const Router: React.FC<ReturnType<typeof mapStateToProps>> = ({ authenticated }) => {
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

const mapStateToProps = (state: RootState) => ({
    authenticated: isLoggedInSelector(state),
});

export default connect(mapStateToProps)(Router);
