import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import { NonAuthRoutes } from '../../routes/routes.types';
import Navbar from '../layout/Navbar';

interface AuthRouteProps {
    component: React.FC<RouteComponentProps>;
    authenticated: boolean;
}

const AuthRoute: React.FC<AuthRouteProps & RouteProps> = ({ component: Component, authenticated, ...rest }) => {
    return (
        <Route
            exact
            {...rest}
            render={(props) =>
                authenticated ? (
                    <>
                        <Navbar />
                        <Component {...props} />
                    </>
                ) : (
                    <Redirect to={{ pathname: NonAuthRoutes.Signup }} />
                )
            }
        />
    );
};

export default AuthRoute;
