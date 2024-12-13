// src/features/routines/components/RoutineForm.tsx
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormField, FormItem } from '@/components/ui/form';
import { TextArea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Routine, RoutineType, RoutineDifficulty, Training } from '../types';
import TrainingEditor from './TrainingEditor';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  type: yup.mixed<RoutineType>().required('Type is required'),
  difficulty: yup.mixed<RoutineDifficulty>().required('Difficulty is required'),
  estimated_time: yup.number().required('Estimated time is required'),
  is_template: yup.boolean().required('Is template is required'),
  mesocycle_type: yup.string().optional(),
  microcycle_type: yup.string().optional(),
  warmup_description: yup.string().optional(),
  cooldown_description: yup.string().optional(),
  notes: yup.string().optional(),
  trainings: yup.array().optional(),
});

interface RoutineFormProps {
  routine?: Routine;
  onSubmit: (data: Omit<Routine, 'id' | 'creator_id'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function RoutineForm({
  routine,
  onSubmit,
  onCancel,
  isLoading,
}: RoutineFormProps) {
  const [activeTab, setActiveTab] = React.useState('details');
  const [trainings, setTrainings] = React.useState<Training[]>(
    routine?.trainings || []
  );

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: routine || {
      name: '',
      description: '',
      type: 'full_body',
      difficulty: 'beginner',
      estimated_time: 60,
      is_template: false,
    },
  });

  const handleSubmit = async (formData: any) => {
    await onSubmit({ ...formData, trainings });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{routine ? 'Edit Routine' : 'Create New Routine'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="details">Routine Details</TabsTrigger>
              <TabsTrigger value="exercises">Exercises</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <FormField name="name">
                <FormItem label="Name">
                  <Input {...form.register('name')} />
                </FormItem>
              </FormField>

              <FormField name="description">
                <FormItem label="Description">
                  <TextArea {...form.register('description')} rows={3} />
                </FormItem>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField name="type">
                  <FormItem label="Type">
                    <Select {...form.register('type')}>
                      <option value="full_body">Full Body</option>
                      <option value="split">Split</option>
                      <option value="upper_lower">Upper Lower</option>
                      <option value="push_pull_legs">Push Pull Legs</option>
                    </Select>
                  </FormItem>
                </FormField>

                <FormField name="difficulty">
                  <FormItem label="Difficulty">
                    <Select {...form.register('difficulty')}>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </Select>
                  </FormItem>
                </FormField>
              </div>

              <FormField name="estimated_time">
                <FormItem label="Estimated Time (minutes)">
                  <Input type="number" {...form.register('estimated_time')} />
                </FormItem>
              </FormField>

              <div className="space-y-4">
                <FormField name="is_template">
                  <FormItem>
                    <Checkbox
                      label="Save as template"
                      {...form.register('is_template')}
                    />
                  </FormItem>
                </FormField>

                <FormField name="warmup_description">
                  <FormItem label="Warm-up Description">
                    <TextArea
                      {...form.register('warmup_description')}
                      rows={2}
                    />
                  </FormItem>
                </FormField>

                <FormField name="cooldown_description">
                  <FormItem label="Cool-down Description">
                    <TextArea
                      {...form.register('cooldown_description')}
                      rows={2}
                    />
                  </FormItem>
                </FormField>

                <FormField name="notes">
                  <FormItem label="Notes">
                    <TextArea {...form.register('notes')} rows={2} />
                  </FormItem>
                </FormField>
              </div>
            </TabsContent>

            <TabsContent value="exercises">
              <TrainingEditor
                trainings={trainings}
                onTrainingsChange={setTrainings}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </span>
              ) : routine ? (
                'Update Routine'
              ) : (
                'Create Routine'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
