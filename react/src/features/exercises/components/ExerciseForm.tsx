// src/features/exercises/components/ExerciseForm.tsx
import { useForm } from 'react-hook-form';
import { Exercise } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextArea } from '@/components/ui/textarea';
import { FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface ExerciseFormProps {
  exercise?: Exercise;
  onSubmit: (data: Omit<Exercise, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ExerciseForm({
  exercise,
  onSubmit,
  onCancel,
  isLoading,
}: ExerciseFormProps) {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: exercise || {
      name: '',
      description: '',
      exercise_type: '',
      main_muscle_group: '',
      required_equipment: '',
      tutorial_url: '',
      technical_instructions: '',
      observations: '',
      measurement_type: 'both',
      is_rm_exercise: false,
    },
  });

  const measurementType = watch('measurement_type');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{exercise ? 'Edit Exercise' : 'Create Exercise'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField name="name">
            <FormItem label="Name">
              <Input {...register('name')} />
            </FormItem>
          </FormField>

          <FormField name="description">
            <FormItem label="Description">
              <TextArea {...register('description')} rows={3} />
            </FormItem>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField name="exercise_type">
              <FormItem label="Exercise Type">
                <Select {...register('exercise_type')}>
                  <option value="">Select Type</option>
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibility</option>
                </Select>
              </FormItem>
            </FormField>

            <FormField name="main_muscle_group">
              <FormItem label="Main Muscle Group">
                <Select {...register('main_muscle_group')}>
                  <option value="">Select Muscle Group</option>
                  <option value="chest">Chest</option>
                  <option value="back">Back</option>
                  <option value="legs">Legs</option>
                  <option value="shoulders">Shoulders</option>
                  <option value="arms">Arms</option>
                  <option value="core">Core</option>
                </Select>
              </FormItem>
            </FormField>
          </div>

          <FormField name="required_equipment">
            <FormItem label="Required Equipment">
              <Input {...register('required_equipment')} />
            </FormItem>
          </FormField>

          <FormField name="tutorial_url">
            <FormItem label="Tutorial URL">
              <Input type="url" {...register('tutorial_url')} />
            </FormItem>
          </FormField>

          <FormField name="technical_instructions">
            <FormItem label="Technical Instructions">
              <TextArea {...register('technical_instructions')} rows={3} />
            </FormItem>
          </FormField>

          <FormField name="observations">
            <FormItem label="Observations">
              <TextArea {...register('observations')} rows={2} />
            </FormItem>
          </FormField>

          <FormField name="measurement_type">
            <FormItem label="Measurement Type">
              <Select {...register('measurement_type')}>
                <option value="RM">RM (Repetition Maximum)</option>
                <option value="Borg">Borg Scale</option>
                <option value="both">Both</option>
              </Select>
            </FormItem>
          </FormField>

          {(measurementType === 'RM' || measurementType === 'both') && (
            <FormField name="is_rm_exercise">
              <FormItem>
                <Checkbox
                  label="Is RM Exercise"
                  {...register('is_rm_exercise')}
                />
              </FormItem>
            </FormField>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Saving...'
                : exercise
                ? 'Update Exercise'
                : 'Create Exercise'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
