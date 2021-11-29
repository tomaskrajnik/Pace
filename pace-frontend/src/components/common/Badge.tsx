import React from 'react';

interface BadgeProps {
    color?: string;
    text: string;
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({ color = 'blue', text, className }) => {
    return (
        <div className={className}>
            <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded bg-${color}-100 text-${color}-800`}
            >
                {text}
            </span>
        </div>
    );
};

export default Badge;
