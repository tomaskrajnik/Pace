import { ViewMode } from 'frappe-gantt-react';
import React from 'react';
interface GanttViewModeButtonsProps {
    onSelected: (mode: ViewMode) => void;
    selectedMode: ViewMode;
}

export const GanttViewModeButtons: React.FC<GanttViewModeButtonsProps> = ({ onSelected, selectedMode }) => {
    return (
        <div className="rounded border-b border-gray-200 shadow inline-block absolute bottom-1 right-1">
            <button
                className={`px-2 py-1 text-sm rounded-tl rounded-bl hover:bg-gray-200 ${
                    selectedMode === ViewMode.QuarterDay && 'bg-blue-500 text-white hover:bg-blue-700'
                }`}
                onClick={() => onSelected(ViewMode.QuarterDay)}
            >
                1/4 Day
            </button>
            <button
                className={`px-2 py-1 text-sm hover:bg-gray-200 ${
                    selectedMode === ViewMode.HalfDay && 'bg-blue-500 text-white hover:bg-blue-700'
                }`}
                onClick={() => onSelected(ViewMode.HalfDay)}
            >
                1/2 Day
            </button>

            <button
                className={`px-2 py-1 text-sm hover:bg-gray-200 ${
                    selectedMode === ViewMode.Day && 'bg-blue-500 text-white hover:bg-blue-700'
                }`}
                onClick={() => onSelected(ViewMode.Day)}
            >
                Day
            </button>
            <button
                className={`px-2 py-1 text-sm hover:bg-gray-200 ${
                    selectedMode === ViewMode.Week && 'bg-blue-500 text-white hover:bg-blue-700'
                }`}
                onClick={() => onSelected(ViewMode.Week)}
            >
                Week
            </button>
            <button
                className={`px-2 py-1 text-sm rounded-tr rounded-br hover:bg-gray-200 ${
                    selectedMode === ViewMode.Month && 'bg-blue-500 text-white hover:bg-blue-700'
                }`}
                onClick={() => onSelected(ViewMode.Month)}
            >
                Month
            </button>
        </div>
    );
};
