import { Task } from 'gantt-task-react';
import React from 'react';
import NormalText from '../common/NormalText';

export const MilestoneListTable: React.FC<{
    rowHeight: number;
    rowWidth: string;

    tasks: Task[];
    selectedTaskId: string;
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
}> = ({ rowHeight, rowWidth, tasks, onExpanderClick }) => {
    return (
        <div>
            {tasks.map((t) => {
                let expanderSymbol = '';
                if (t.hideChildren === false) {
                    expanderSymbol = '▼';
                } else if (t.hideChildren === true) {
                    expanderSymbol = '▶';
                }

                return (
                    <div
                        className="flex items-center pl-4 tr tr-border-right cursor-pointer"
                        style={{ height: rowHeight }}
                        key={`${t.id}row`}
                    >
                        <div
                            style={{
                                minWidth: rowWidth,
                                maxWidth: rowWidth,
                            }}
                            title={t.name}
                        >
                            <div className="flex items-center">
                                <div onClick={() => onExpanderClick(t)}>{expanderSymbol}</div>

                                <div
                                    className="w-4 h-4 rounded mr-2"
                                    style={{ backgroundColor: t.styles?.backgroundColor }}
                                ></div>
                                <NormalText className="font-bold">{t.name}</NormalText>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div className="py-2 pl-4">
                <NormalText>Add new</NormalText>
            </div>
        </div>
    );
};
