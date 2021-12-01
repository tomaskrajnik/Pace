import { CalendarIcon, PencilAltIcon } from '@heroicons/react/solid';
import moment from 'moment';
import React from 'react';
import { Milestone } from '../../models/milestones.model';
import NormalText from '../common/NormalText';

interface PreviewMilestoneProps {
    milestone: Milestone;
    onEditPressed?: () => void;
}

export const PreviewMilestone: React.FC<PreviewMilestoneProps> = ({ milestone, onEditPressed }) => {
    return (
        <div className="bg-white rounded-lg pb-4 sm:pb-4">
            <div className="col-span-3 mt-3 sm:col-span-2">
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <div className="w-5 h-5 rounded-md mr-2" style={{ backgroundColor: milestone.color }}></div>
                        <NormalText className="text-2xl">{milestone.name}</NormalText>
                    </div>
                    {onEditPressed && (
                        <button
                            onClick={onEditPressed}
                            className="px-4 py-2 items-center text-sm font-bold text-gray-400 rounded-md bg-gray-50 hover:bg-gray-100 flex"
                        >
                            <PencilAltIcon className="w-4 h-4 text-gray-400 mr-1" />
                            Edit
                        </button>
                    )}
                </div>
                <div className="flex mt-4 items-center">
                    <CalendarIcon className="text-gray-500 w-4 h-4 mr-1" />
                    <NormalText className="font-bold mr-1">
                        <span className="text-gray-500 text-sm">Sart date:</span>
                    </NormalText>
                    <NormalText className="text-gray-500 font-md">
                        {moment(new Date(milestone.startDate)).format('MM-DD-YYYY')}
                    </NormalText>
                </div>
                <div className="flex mt-2 items-center">
                    <CalendarIcon className="text-gray-500 w-4 h-4 mr-1" />
                    <NormalText className="font-bold mr-1">
                        <span className="text-gray-500 text-sm">End date:</span>
                    </NormalText>
                    <NormalText className="text-gray-500 font-md">
                        {moment(new Date(milestone.endDate)).format('MM-DD-YYYY')}
                    </NormalText>
                </div>
                <div className="mt-4">
                    <NormalText className="font-bold mr-1">
                        <span className="text-gray-500 text-sm">Description:</span>
                    </NormalText>
                    <NormalText className="text-gray-500 font-md">{milestone.description}</NormalText>
                </div>
                <div className="mt-4">
                    <NormalText className="font-bold mr-1">
                        <span className="text-gray-500 text-sm">Tasks:</span>
                    </NormalText>
                </div>
            </div>
        </div>
    );
};
