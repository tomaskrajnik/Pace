import React from 'react';

interface NormalTextProps {
    className?: string;
}

const NormalText: React.FC<NormalTextProps> = ({ className, children }) => {
    return <p className={`ml-2 block text-sm text-gray-900 ${className}`}>{children}</p>;
};

export default NormalText;
