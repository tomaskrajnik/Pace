import React from 'react';

const Screen: React.FC = ({ children }) => {
    return <div className="h-screen bg-gray-50">{children}</div>;
};

export default Screen;
