import React from 'react';
import { useSelector } from 'react-redux';
import NormalHeader from '../../components/common/NormalHeader';
import Screen from '../../components/layout/Screen';
import { userSelector } from '../../store/auth/auth.selectors';

const Dashboard: React.FC = ({}) => {
    const user = useSelector(userSelector);
    if (!user) return null;
    return (
        <Screen>
            <div>
                <NormalHeader>{`Welcome, ${user.name.split(' ')[0]} 👋!`}</NormalHeader>
            </div>
        </Screen>
    );
};

export default Dashboard;
