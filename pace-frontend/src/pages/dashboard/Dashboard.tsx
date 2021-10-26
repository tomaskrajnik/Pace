import React from 'react';
import { AuthThunkDispatcher } from '../../store/auth/auth.types';
import { connect, useDispatch } from 'react-redux';
import * as authThunks from '../../store/auth/auth.thunk';
import { RootState } from '../../store';

const Dashboard: React.FC<ReturnType<typeof mapStateToProps>> = ({ user }) => {
    const thunkDispatch = useDispatch<AuthThunkDispatcher>();
    const handleLogOut = async () => {
        await thunkDispatch(authThunks.logout());
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleLogOut}>Log out</button>
            <h2>{`Hello ${user.name}`}</h2>
        </div>
    );
};

const mapStateToProps = (state: RootState) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(Dashboard);
