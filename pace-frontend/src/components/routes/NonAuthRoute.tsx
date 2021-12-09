import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import { AuthRoutes } from '../../routes/routes.types';

interface NonAuthRouteProps {
    component: React.FC<RouteComponentProps>;
    authenticated: boolean;
}

const NonAuthRouteProps: React.FC<NonAuthRouteProps & RouteProps> = ({
    component: Component,
    authenticated,
    ...rest
}) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                !authenticated ? <Component {...props} /> : <Redirect to={{ pathname: AuthRoutes.Dashboard }} />
            }
        />
    );
};

export default NonAuthRouteProps;
