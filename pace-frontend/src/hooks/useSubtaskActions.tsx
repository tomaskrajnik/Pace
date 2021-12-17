import { useState } from 'react';
import { toast } from 'react-toastify';
import SubtasksService from '../services/SubtasksService';
import { CreateSubtasktRequest } from '../services/SubtasksService.types';

interface SubtaskActions {
    createSubtask: (data: CreateSubtasktRequest, callback?: () => void) => Promise<void>;
    loading: boolean;
}

export const useSubtaskActions = (): SubtaskActions => {
    const [loading, setLoading] = useState(false);
    const createSubtask = async (data: CreateSubtasktRequest, callback?: () => void) => {
        try {
            setLoading(true);

            await SubtasksService.createSubtask(data);
            toast.success('Subtask created');
            callback?.();
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return { createSubtask, loading };
};
