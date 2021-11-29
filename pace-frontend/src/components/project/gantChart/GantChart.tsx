import React, { useEffect, useState } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import moment from 'moment';
import { Milestone } from '../../../models/milestones.model';
import { MilestoneListHeader } from '../../milestones/MilestoneListHeader';
import { MilestoneListTable } from '../../milestones/MilestoneListTable';
import { useDispatch, useSelector } from 'react-redux';
import { milestonesSelector } from '../../../store/milestones/milestones.selector';
import { setMilestones } from '../../../store/milestones/milestones.actions';
import { GanttViewModeButtons } from './GantViewModeButton';

export const GantChart: React.FC = () => {
    const [viewMode, setViewMode] = useState(ViewMode.Month);
    const [tasks, setTasks] = useState<Task[]>([]);
    const milestones = useSelector(milestonesSelector);
    const dispatch = useDispatch();
    const columnWidth = React.useMemo(() => {
        switch (viewMode) {
            case ViewMode.Day:
                return 300;
            case ViewMode.HalfDay:
                return 250;
            case ViewMode.QuarterDay:
                return 150;
            case ViewMode.Week:
                return 120;
            case ViewMode.Month:
                return 100;
        }
    }, [viewMode]);

    const mapMilestonesToTasks = (milestones: Milestone[]) => {
        const mappedtasks: Task[] = [];
        milestones.forEach((m) => {
            mappedtasks.push({
                id: m.uid,
                name: m.name,
                start: moment(m.startDate).toDate(),
                end: moment(m.endDate).toDate(),
                progress: 10,
                dependencies: [...m.subtasks],
                isDisabled: false,
                styles: { progressColor: m.color, backgroundColor: m.color, progressSelectedColor: m.color },
            } as Task);
        });
        return mappedtasks;
    };

    const handleTaskChange = (task: Task) => {
        if (!milestones) return;
        const newMilestones: Milestone[] = milestones.map((m) =>
            m.uid === task.id ? { ...m, startDate: task.start.getTime(), endDate: task.end.getTime() } : m,
        );
        dispatch(setMilestones(newMilestones));
    };

    const handleTaskDelete = (task: Task) => {
        const conf = window.confirm('Are you sure about ' + task.name + ' ?');
        if (conf) {
            setTasks(tasks.filter((t) => t.id !== task.id));
        }
        return conf;
    };

    const handleProgressChange = async (task: Task) => {
        setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    };

    const handleDblClick = (task: Task) => {
        alert('On Double Click event Id:' + task.id);
    };

    const handleSelect = (task: Task, isSelected: boolean) => {
        console.log(task.name + ' has ' + (isSelected ? 'selected' : 'unselected'));
    };

    useEffect(() => {
        if (!milestones) return;
        const _tasks = mapMilestonesToTasks(milestones);

        setTasks(_tasks);
    }, [milestones]);

    return (
        <div>
            <div className="mt-8 overflow-hidden shadow border-b border-gray-200 sm:rounded-lg relative">
                {tasks.length !== 0 && (
                    <Gantt
                        onDateChange={handleTaskChange}
                        onDelete={handleTaskDelete}
                        onProgressChange={handleProgressChange}
                        onDoubleClick={handleDblClick}
                        onSelect={handleSelect}
                        barCornerRadius={4}
                        viewMode={viewMode}
                        columnWidth={columnWidth}
                        tasks={tasks}
                        headerHeight={65}
                        listCellWidth="250px"
                        rowHeight={45}
                        barFill={70}
                        fontSize="12px"
                        arrowColor="#9CA3AF"
                        TaskListHeader={({ headerHeight, rowWidth }) => (
                            <MilestoneListHeader headerHeight={headerHeight} rowWidth={rowWidth} />
                        )}
                        TaskListTable={({
                            rowHeight,
                            rowWidth,
                            tasks,
                            selectedTaskId,
                            setSelectedTask,
                            onExpanderClick,
                        }) => (
                            <MilestoneListTable
                                tasks={tasks}
                                selectedTaskId={selectedTaskId}
                                onExpanderClick={onExpanderClick}
                                setSelectedTask={setSelectedTask}
                                rowHeight={rowHeight}
                                rowWidth={rowWidth}
                            />
                        )}
                    />
                )}
                <GanttViewModeButtons selectedMode={viewMode} onSelected={setViewMode} />
            </div>
        </div>
    );
};
