import { useState } from 'react';
import { toast } from 'react-toastify';
import SubtasksService from '../services/SubtasksService';
import { CreateSubtasktRequest, UpdateSubtasktRequest } from '../services/SubtasksService.types';

interface SubtaskActions {
    createSubtask: (data: CreateSubtasktRequest, callback?: () => void) => Promise<void>;
    updateSubtask: (subtaskId: string, data: UpdateSubtasktRequest, callback?: () => void) => Promise<void>;
    deleteSubtask: (subtaskId: string, callback?: () => void) => Promise<void>;
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

    const updateSubtask = async (subtaskId: string, data: UpdateSubtasktRequest, callback?: () => void) => {
        try {
            setLoading(true);
            await SubtasksService.updateSubtask(subtaskId, data);
            toast.success('Subtask updated');
            callback?.();
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const deleteSubtask = async (subtaskId: string, callback?: () => void) => {
        try {
            setLoading(true);
            await SubtasksService.deleteSubtask(subtaskId);
            toast.success('Subtask deleted');
            callback?.();
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return { createSubtask, updateSubtask, deleteSubtask, loading };
};
