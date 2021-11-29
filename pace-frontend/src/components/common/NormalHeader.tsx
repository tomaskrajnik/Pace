import React from 'react';
import NormalText from './NormalText';

interface NormalHeaderProps {
    className?: string;
}

const NormalHeader: React.FC<NormalHeaderProps> = ({ className, children }) => {
    return <NormalText className={`text-3xl font-bold text-gray-700 ${className}`}>{children}</NormalText>;
};

export default NormalHeader;
