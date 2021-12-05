import React, { useState, useMemo } from 'react';
import { Milestone } from '../../models/milestones.model';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Input from '../form/Input';
import NormalText from '../common/NormalText';
import { ColorSelector } from '../form/ColorSelector';
import { CustomDatePicker } from '../../components/form/CustomDatePicker';
import { PaceColorsEnum } from '../../utils/colors';
import DatePicker from 'react-datepicker';
import NormalButton from '../common/NormalButton';
import { UpdateMilestoneRequest } from '../../services/MilestoneService.types';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import MilestonesService from '../../services/MilestonesService';

interface EditMilestoneFormProps {
    milestone: Milestone;
    onEditModeExit?: () => void;
}

interface IFormInputs {
    name: string;
    description: string;
}

const schema = yup.object().shape({
    name: yup.string().min(3).max(25).label('Milestone name').required(),
});

export const EditMilestoneForm: React.FC<EditMilestoneFormProps> = ({ milestone, onEditModeExit }) => {
    const { id: projectId } = useParams<{ id: string }>();
    const [startDate, setStartDate] = useState<Date>(new Date(milestone.startDate));
    const [endDate, setEndDate] = useState<Date>(new Date(milestone.endDate));
    const [color, setColor] = useState<string | PaceColorsEnum>(milestone.color);
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<IFormInputs>({
        defaultValues: {
            name: milestone.name,
            description: milestone.description,
        },
        mode: 'onSubmit',
        resolver: yupResolver(schema),
    });

    const isFormDirty = useMemo(
        () =>
            isDirty ||
            startDate.getTime() !== milestone.startDate ||
            endDate.getTime() !== milestone.endDate ||
            color !== milestone.color,
        [isDirty, startDate, endDate, milestone, color],
    );

    const handleMilestoneUpdate = async (data: { name: string; description: string }) => {
        const dataToUpdate: UpdateMilestoneRequest = {
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            color,
            projectId,
            ...data,
        };

        try {
            setLoading(true);
            await MilestonesService.updateMilestone(milestone.uid, dataToUpdate);
            toast.success('Update successfull');
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
            onEditModeExit?.();
        }
    };

    return (
        <div>
            <div className="bg-white rounded-lg pb-4 sm:pb-4">
                <div className="col-span-3 mt-3 sm:col-span-2">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                onChange={onChange}
                                value={value}
                                name="name"
                                label="Milestone name:"
                                position="standalone"
                                id="name"
                                type="text"
                                error={errors.name?.message ? true : false}
                            />
                        )}
                    />
                    <NormalText className="text-red-500 mt-1">{errors.name?.message}</NormalText>
                </div>
                <div className="col-span-3 justify-between flex mt-3 sm:col-span-2">
                    <div>
                        <NormalText>Start date:</NormalText>
                        <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={startDate}
                            onChange={(date: Date | null) => date && setStartDate(date)}
                            customInput={React.createElement(React.forwardRef(CustomDatePicker))}
                        />
                    </div>
                    <div>
                        <NormalText>End date:</NormalText>
                        <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={endDate}
                            onChange={(date: Date | null) => date && setEndDate(date)}
                            customInput={React.createElement(React.forwardRef(CustomDatePicker))}
                            minDate={endDate}
                        />
                    </div>
                </div>
                <div className="col-span-3 mt-3 sm:col-span-2">
                    <NormalText>Description:</NormalText>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <textarea
                                onChange={onChange}
                                value={value}
                                id="description"
                                name="description"
                                rows={3}
                                className="shadow-sm mt-2 focus:ring-indigo-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                placeholder="Short description"
                                defaultValue={''}
                            />
                        )}
                    />
                </div>
                <div className="flex items-center mt-4">
                    <NormalText className="text-sm font-medium text-gray-700 mr-2">Color:</NormalText>
                    <ColorSelector selected={color} onSelected={(col) => setColor(col)} />
                </div>
                <div className="mt-4 flex justify-end">
                    {onEditModeExit && (
                        <div className="flex w-40 mr-2">
                            <NormalButton
                                variant="tertiary"
                                className="shadow"
                                title="Cancel"
                                onClick={onEditModeExit}
                            />
                        </div>
                    )}
                    <div className="flex w-40">
                        <NormalButton
                            loading={loading}
                            className="shadow"
                            disabled={!isFormDirty}
                            title="Save"
                            onClick={handleSubmit(handleMilestoneUpdate)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
