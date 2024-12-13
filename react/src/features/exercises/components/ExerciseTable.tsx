// src/features/exercises/components/ExerciseTable.tsx

import * as React from 'react';
import { Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Exercise } from '../types';

interface ExerciseTableProps {
  exercises: Exercise[];
  isLoading?: boolean;
  onExerciseClick?: (exercise: Exercise) => void;
  onFilterChange?: (filters: ExerciseFilters) => void;
}

interface ExerciseFilters {
  search: string;
  type: string;
  muscle_group: string;
  measurement_type: string;
}

const ExerciseTable = ({
  exercises,
  isLoading,
  onExerciseClick,
  onFilterChange,
}: ExerciseTableProps) => {
  const [sortColumn, setSortColumn] = React.useState<keyof Exercise>('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
    'asc'
  );
  const [filters, setFilters] = React.useState<ExerciseFilters>({
    search: '',
    type: '',
    muscle_group: '',
    measurement_type: '',
  });

  const handleFilterChange = (key: keyof ExerciseFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSort = (column: keyof Exercise) => {
    setSortDirection((current) =>
      sortColumn === column && current === 'asc' ? 'desc' : 'asc'
    );
    setSortColumn(column);
  };

  const columns = [
    {
      key: 'name' as const,
      header: 'Name',
      sortable: true,
    },
    {
      key: 'exercise_type' as const,
      header: 'Type',
      sortable: true,
    },
    {
      key: 'main_muscle_group' as const,
      header: 'Muscle Group',
      sortable: true,
    },
    {
      key: 'required_equipment' as const,
      header: 'Equipment',
    },
    {
      key: 'measurement_type' as const,
      header: 'Measurement',
      cell: (exercise: Exercise) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            exercise.measurement_type === 'RM'
              ? 'bg-blue-100 text-blue-800'
              : exercise.measurement_type === 'Borg'
              ? 'bg-green-100 text-green-800'
              : 'bg-purple-100 text-purple-800'
          }`}
        >
          {exercise.measurement_type}
        </span>
      ),
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Exercises</CardTitle>
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search exercises..."
              className="pl-8 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
          </select>
          <select
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filters.muscle_group}
            onChange={(e) => handleFilterChange('muscle_group', e.target.value)}
          >
            <option value="">All Muscle Groups</option>
            <option value="chest">Chest</option>
            <option value="back">Back</option>
            <option value="legs">Legs</option>
            <option value="shoulders">Shoulders</option>
            <option value="arms">Arms</option>
            <option value="core">Core</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <Table
          data={exercises}
          columns={columns}
          loading={isLoading}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={onExerciseClick}
          className="border-t border-gray-200"
        />
      </CardContent>
    </Card>
  );
};

export default ExerciseTable;
