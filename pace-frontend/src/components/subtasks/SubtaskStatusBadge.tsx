import React from 'react';
import { SubtasksStatus } from '../../models/subtasks.model';

interface SubtaskStatusBadgeProps {
    status: SubtasksStatus;
    size?: 'small' | 'large';
}

const BadgeComponent: React.FC<{ color: string; className?: string; text: string; size: 'small' | 'large' }> = ({
    color,
    className,
    text,
    size,
}) => {
    return (
        <div className={className}>
            {size === 'large' ? (
                <span
                    className={`px-4 py-1 inline-flex text-md leading-5 font-bold rounded-md bg-${color}-400 text-white`}
                >
                    {text.toUpperCase()}
                </span>
            ) : (
                <span className={`px-1 py-0.5 inline-flex text-xs font-bold rounded bg-${color}-400 text-white`}>
                    {text.toUpperCase()}
                </span>
            )}
        </div>
    );
};

export const SubtaskStatusBadge: React.FC<SubtaskStatusBadgeProps> = ({ status, size = 'large' }) => {
    switch (status) {
        case SubtasksStatus.ToDo:
            return <BadgeComponent size={size} className="mt-1.5" color="gray" text="To do" />;
        case SubtasksStatus.InProgress:
            return <BadgeComponent size={size} className="mt-1.5" color="yellow" text="In progress" />;
        case SubtasksStatus.Done:
            return <BadgeComponent size={size} className="mt-1.5" color="green" text="Done" />;
    }
};
