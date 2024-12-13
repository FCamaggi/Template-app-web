import React from 'react';
import { useForm } from 'react-hook-form';
import { Training } from '../types';
import SetEditor from './SetEditor';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { FormField, FormItem } from '@/components/ui/form';

interface TrainingSettingsProps {
  training: Training;
  onSave: (training: Training) => void;
  onClose: () => void;
}

const TrainingSettings: React.FC<TrainingSettingsProps> = ({
  training,
  onSave,
  onClose,
}) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      training_type: training.training_type,
      notes: training.notes || '',
      tempo: training.tempo || '',
      unilateral: training.unilateral,
    },
  });

  const onSubmit = (data: any) => {
    onSave({
      ...training,
      ...data,
    });
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Exercise Settings</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField name="training_type">
            <FormItem label="Training Type">
              <select
                {...register('training_type')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="strength">Strength</option>
                <option value="hypertrophy">Hypertrophy</option>
                <option value="endurance">Endurance</option>
                <option value="power">Power</option>
              </select>
            </FormItem>
          </FormField>

          <FormField name="tempo">
            <FormItem label="Tempo (e.g., '3-1-3-0')">
              <Input {...register('tempo')} placeholder="X-X-X-X" />
            </FormItem>
          </FormField>

          <FormField name="notes">
            <FormItem label="Notes">
              <TextArea {...register('notes')} rows={3} />
            </FormItem>
          </FormField>

          <FormField name="unilateral">
            <FormItem>
              <Checkbox
                {...register('unilateral')}
                label="Unilateral Exercise"
              />
            </FormItem>
          </FormField>

          <DialogFooter>
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </DialogFooter>
          <div className="border-t pt-4">
            <SetEditor
              training={training}
              onSetsChange={(sets) => {
                // Actualizamos el training con los nuevos sets
                const updatedTraining = {
                  ...training,
                  sets,
                };
                onSave(updatedTraining);
              }}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingSettings;
