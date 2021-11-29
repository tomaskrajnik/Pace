import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ScreenProps {
    // Taiwlind class
    backgroundColorClass?: string;
    withoutopPadding?: boolean;
}

const Screen: React.FC<ScreenProps> = ({ backgroundColorClass = 'bg-gray-50', withoutopPadding = false, children }) => {
    return (
        <>
            <div className={`min-h-screen  w-screen ${backgroundColorClass} ${!withoutopPadding && 'py-24'}`}>
                <div className="max-w-screen-2xl m-auto px-4 sm:px-6 lg:px-8">{children}</div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
};

export default Screen;
