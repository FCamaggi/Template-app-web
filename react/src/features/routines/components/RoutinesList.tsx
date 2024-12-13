import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Dumbbell,
  Clock,
  Copy,
  Pencil,
  Trash,
  Play,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useRoutines } from '../hooks/useRoutines';
import { Routine } from '../types';

interface RoutineCardProps {
  routine: Routine;
  onEdit: (routine: Routine) => void;
  onDelete: (id: number) => void;
  onDuplicate: (id: number) => void;
}

const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const navigate = useNavigate();

  const handleStartWorkout = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se propague al evento de edición
    navigate(`/sessions/${routine.id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{routine.name}</span>
          <div className="flex gap-2">
            <button
              onClick={handleStartWorkout}
              className="p-1 hover:bg-primary-100 text-primary-600 rounded"
              title="Start workout"
            >
              <Play className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(routine.id);
              }}
              className="p-1 hover:bg-gray-100 rounded"
              title="Duplicate routine"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(routine);
              }}
              className="p-1 hover:bg-gray-100 rounded"
              title="Edit routine"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(routine.id);
              }}
              className="p-1 hover:bg-gray-100 rounded text-red-600"
              title="Delete routine"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{routine.description}</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Dumbbell className="h-4 w-4" />
              <span>{routine.type}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{routine.estimated_time} min</span>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
              {routine.difficulty}
            </span>
            {routine.is_template && (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                Template
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RoutineFilters: React.FC<{
  onFilterChange: (key: string, value: string | boolean | undefined) => void;
}> = ({ onFilterChange }) => (
  <div className="flex gap-4 mb-6">
    <select
      className="px-3 py-2 border rounded-md"
      onChange={(e) => onFilterChange('type', e.target.value || undefined)}
    >
      <option value="">All Types</option>
      <option value="full_body">Full Body</option>
      <option value="split">Split</option>
      <option value="upper_lower">Upper Lower</option>
      <option value="push_pull_legs">Push Pull Legs</option>
    </select>
    <select
      className="px-3 py-2 border rounded-md"
      onChange={(e) =>
        onFilterChange('difficulty', e.target.value || undefined)
      }
    >
      <option value="">All Difficulties</option>
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="advanced">Advanced</option>
    </select>
    <select
      className="px-3 py-2 border rounded-md"
      onChange={(e) =>
        onFilterChange(
          'is_template',
          e.target.value === 'true' ? true : undefined
        )
      }
    >
      <option value="">All Routines</option>
      <option value="true">Templates Only</option>
      <option value="false">Personal Only</option>
    </select>
  </div>
);

const RoutinesList: React.FC<{
  onCreateNew: () => void;
}> = ({ onCreateNew }) => {
  const {
    routines,
    isLoading,
    deleteRoutine,
    duplicateRoutine,
    updateFilters,
    selectRoutine,
  } = useRoutines();

  const handleFilterChange = (
    key: string,
    value: string | boolean | undefined
  ) => {
    updateFilters({ [key]: value });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Routines</h2>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Create Routine</span>
        </button>
      </div>

      <RoutineFilters onFilterChange={handleFilterChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            onEdit={selectRoutine}
            onDelete={deleteRoutine}
            onDuplicate={duplicateRoutine}
          />
        ))}
      </div>
    </div>
  );
};

export default RoutinesList;
