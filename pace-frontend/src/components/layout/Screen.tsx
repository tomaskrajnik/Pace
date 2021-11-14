import React from 'react';

interface ScreenProps {
    // Taiwlind class
    backgroundColorClass?: string;
    withoutopPadding?: boolean;
}

const Screen: React.FC<ScreenProps> = ({ backgroundColorClass = 'bg-gray-50', withoutopPadding = false, children }) => {
    return (
        <div className={`min-h-screen  w-screen ${backgroundColorClass} ${!withoutopPadding && 'py-20'}`}>
            <div className="max-w-screen-2xl m-auto px-4 sm:px-6 lg:px-8">{children}</div>
        </div>
    );
};

export default Screen;
