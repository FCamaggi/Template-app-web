import React from 'react';
import {
  TrendingUp,
  Weight,
  Dumbbell,
  Hash,
  Activity,
  BarChart2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressStats } from '../types';

interface ProgressStatsSummaryProps {
  stats: ProgressStats;
  weightUnit?: 'kg' | 'lbs';
}

export default function ProgressStatsSummary({
  stats,
  weightUnit = 'kg',
}: ProgressStatsSummaryProps) {
  const statItems = [
    {
      title: 'Max Weight',
      value: `${stats.maxWeight} ${weightUnit}`,
      change: calculateWeightProgress(stats.weightProgression),
      icon: Weight,
      tooltip: 'Highest weight used for this exercise',
    },
    {
      title: 'Avg Weight',
      value: `${stats.avgWeight.toFixed(1)} ${weightUnit}`,
      icon: Dumbbell,
      tooltip: 'Average weight across all sets',
    },
    {
      title: 'Max Reps',
      value: stats.maxReps.toString(),
      icon: Hash,
      tooltip: 'Maximum repetitions in a single set',
    },
    {
      title: 'Total Volume',
      value: calculateTotalVolume(stats),
      change: calculateVolumeProgress(stats.volumeProgression),
      icon: BarChart2,
      tooltip: 'Total weight × reps over time',
    },
    {
      title: 'Total Sets',
      value: stats.totalSets.toString(),
      icon: TrendingUp,
      tooltip: 'Total number of sets performed',
    },
  ];

  // Añadir estadísticas de Borg si están disponibles
  if (stats.avgBorg) {
    statItems.push({
      title: 'Avg Intensity',
      value: `${stats.avgBorg.toFixed(1)} Borg`,
      icon: Activity,
      tooltip: 'Average perceived intensity (Borg scale)',
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statItems.map((item) => (
        <StatCard key={item.title} {...item} />
      ))}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ElementType;
  tooltip: string;
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  tooltip,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Icon className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600" title={tooltip}>
                {title}
              </p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
          {typeof change === 'number' && (
            <div
              className={`text-sm font-medium ${
                change > 0
                  ? 'text-green-600'
                  : change < 0
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {change > 0 && '+'}
              {change.toFixed(1)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Funciones auxiliares para cálculos
function calculateWeightProgress(
  progression: { date: string; weight: number }[]
): number {
  if (progression.length < 2) return 0;
  const first = progression[0].weight;
  const last = progression[progression.length - 1].weight;
  return ((last - first) / first) * 100;
}

function calculateVolumeProgress(
  progression: { date: string; volume: number }[]
): number {
  if (progression.length < 2) return 0;
  const first = progression[0].volume;
  const last = progression[progression.length - 1].volume;
  return ((last - first) / first) * 100;
}

function calculateTotalVolume(stats: ProgressStats): string {
  const totalVolume = stats.volumeProgression.reduce(
    (sum, item) => sum + item.volume,
    0
  );
  if (totalVolume > 1000) {
    return `${(totalVolume / 1000).toFixed(1)}k`;
  }
  return totalVolume.toString();
}
