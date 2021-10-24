import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import { NonAuthRoutes } from '../../routes/routes.types';

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
                authenticated ? <Component {...props} /> : <Redirect to={{ pathname: NonAuthRoutes.Signup }} />
            }
        />
    );
};

export default AuthRoute;
