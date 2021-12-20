import React, { useEffect, useState } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import moment from 'moment';
import { Milestone } from '../../../models/milestones.model';
import { MilestoneListHeader } from '../../milestones/MilestoneListHeader';
import { MilestoneListTable } from '../../milestones/MilestoneListTable';
import { useSelector } from 'react-redux';
import { milestonesSelector } from '../../../store/milestones/milestones.selector';
import { GanttViewModeButtons } from './GantViewModeButton';
import { MilestoneToolTip } from '../../milestones/MilestoneToolTip';
import { MilestoneSlideOver } from '../../milestones/MilestoneSlideOver';
import MilestonesService from '../../../services/MilestonesService';
import NormalText from '../../common/NormalText';
import NormalButton from '../../common/NormalButton';

interface GantChartProps {
    onAddNew: () => void;
}

export const GantChart: React.FC<GantChartProps> = ({ onAddNew }) => {
    const [viewMode, setViewMode] = useState(ViewMode.Month);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [milestoneToOpen, setMilestoneToOpen] = useState<{ milestone: Milestone | null; isOpen: boolean }>({
        milestone: null,
        isOpen: false,
    });

    const milestones = useSelector(milestonesSelector);

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

    if (!milestones) return null;

    const mapMilestonesToTasks = (milestones: Milestone[]) => {
        const mappedtasks: Task[] = [];
        milestones.forEach((m) => {
            mappedtasks.push({
                id: m.uid,
                name: m.name,
                start: moment(m.startDate).toDate(),
                end: moment(m.endDate).toDate(),
                progress: 10,
                isDisabled: false,
                styles: { progressColor: m.color, backgroundColor: m.color, progressSelectedColor: m.color },
            } as Task);
        });
        return mappedtasks;
    };

    const handleTaskChange = async (task: Task) => {
        if (!milestones) return;

        const updateData: Partial<Milestone> = { startDate: task.start.getTime(), endDate: task.end.getTime() };

        await MilestonesService.updateMilestone(task.id, updateData);
    };

    const handleProgressChange = async (task: Task) => {
        setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    };

    const handleDblClick = (task: Task) => {
        handleOpenSlideOver(task);
    };

    const handleOpenSlideOver = (task: Task) => {
        const milestone = milestones.filter((m) => m.uid === task.id);
        setMilestoneToOpen({ milestone: milestone[0], isOpen: true });
    };

    useEffect(() => {
        if (!milestones) return;
        const _tasks = mapMilestonesToTasks(milestones);

        setTasks(_tasks);
    }, [milestones]);

    return (
        <div>
            <div className="mt-8 shadow overflow-hidden bg-white border border-gray-200 overflow-x-scroll rounded-lg relative">
                {tasks.length !== 0 ? (
                    <Gantt
                        onDateChange={handleTaskChange}
                        onProgressChange={handleProgressChange}
                        onDoubleClick={handleDblClick}
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
                        TooltipContent={({ task }) => <MilestoneToolTip task={task} />}
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
                                onMilestoneClick={(t) => handleOpenSlideOver(t)}
                                selectedTaskId={selectedTaskId}
                                onExpanderClick={onExpanderClick}
                                setSelectedTask={setSelectedTask}
                                rowHeight={rowHeight}
                                rowWidth={rowWidth}
                                onAddNew={onAddNew}
                            />
                        )}
                    />
                ) : (
                    <div className="h-48  flex items-center justify-center">
                        <div className="flex flex-col ">
                            <NormalText>You don't have any milestones yet</NormalText>
                            <div className="w-32 mt-6 self-center">
                                <NormalButton title="Add new" onClick={onAddNew} variant="primary" />
                            </div>
                        </div>
                    </div>
                )}

                {/** Filter buttons for changing the view mode */}
                {milestones.length !== 0 && <GanttViewModeButtons selectedMode={viewMode} onSelected={setViewMode} />}

                {/** Slide over opening the whole milestone */}
                {milestoneToOpen && (
                    <MilestoneSlideOver
                        milestone={milestoneToOpen.milestone}
                        isOpen={milestoneToOpen.isOpen}
                        onClose={() => {
                            setMilestoneToOpen((prev) => ({ ...prev, isOpen: false }));
                        }}
                    />
                )}
            </div>
        </div>
    );
};
