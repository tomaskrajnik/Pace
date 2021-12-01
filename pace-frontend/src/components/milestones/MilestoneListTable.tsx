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
    onMilestoneClick: (t: Task) => void;
    onAddNew: () => void;
}> = ({ rowHeight, rowWidth, tasks, onMilestoneClick, onAddNew }) => {
    return (
        <div>
            {tasks.map((t) => {
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
                                <div
                                    className="w-4 h-4 rounded mr-2"
                                    style={{ backgroundColor: t.styles?.backgroundColor }}
                                ></div>
                                <div onClick={() => onMilestoneClick(t)}>
                                    <NormalText className="font-bold hover:underline cursor-pointer">
                                        {t.name}
                                    </NormalText>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            <button onClick={onAddNew} className="py-2 pl-4">
                <NormalText className="hover:underline cursor-pointer">+ Add new</NormalText>
            </button>
        </div>
    );
};
