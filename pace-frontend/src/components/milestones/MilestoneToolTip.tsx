import React from 'react';
import { Task } from 'gantt-task-react';
import NormalText from '../common/NormalText';
import moment from 'moment';

interface MilestoneToolTipProps {
    task: Task;
}

export const MilestoneToolTip: React.FC<MilestoneToolTipProps> = ({ task }) => {
    return (
        <div className="p-2 bg-white rounded shadow border-b border-gray-200 pr-6">
            <div className="flex items-center">
                <div className="w-3 h-3 rounded mr-1" style={{ backgroundColor: task.styles?.backgroundColor }}></div>
                <NormalText className="font-bold text-gray-600 text-sm">{task.name}</NormalText>
            </div>
            <NormalText>
                <span className="text-gray-600 font-bold text-xs">Start:</span>{' '}
                <span className="text-gray-500 text-xs"> {moment(task.start).format('MM/DD/YYYY')}</span>
            </NormalText>
            <NormalText>
                <span className="text-gray-600 font-bold text-xs">End:</span>{' '}
                <span className="text-gray-500 text-xs"> {moment(task.end).format('MM/DD/YYYY')}</span>
            </NormalText>
        </div>
    );
};
