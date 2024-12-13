import { format, startOfWeek, eachDayOfInterval, addDays } from 'date-fns';
import { Calendar, Trophy, Flame, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityStats {
  workoutsCompleted: number;
  currentStreak: number;
  totalTime: number;
  achievements: number;
}

interface ActivityLog {
  date: string;
  duration: number;
  routineName: string;
}

interface ActivitySectionProps {
  stats: ActivityStats;
  recentLogs: ActivityLog[];
  recentActivity?: ActivityLog[];
  isLoading?: boolean;
}

export function ActivitySection({
  stats,
  recentLogs,
  isLoading,
}: ActivitySectionProps) {
  // Calculate days for the activity calendar
  const today = new Date();
  const weekStart = startOfWeek(today);
  const days = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6),
  });

  const statCards = [
    {
      title: 'Workouts',
      value: stats.workoutsCompleted,
      icon: Calendar,
      description: 'Total completed',
    },
    {
      title: 'Streak',
      value: stats.currentStreak,
      icon: Flame,
      description: 'Current days',
      highlight: stats.currentStreak >= 3,
    },
    {
      title: 'Training Time',
      value: `${Math.round(stats.totalTime / 60)}h`,
      icon: Clock,
      description: 'This month',
    },
    {
      title: 'Achievements',
      value: stats.achievements,
      icon: Trophy,
      description: 'Total earned',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-10 w-10 rounded-lg bg-gray-200" />
              <div className="mt-4 h-4 w-20 rounded bg-gray-200" />
              <div className="mt-2 h-6 w-16 rounded bg-gray-200" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary-50 p-2">
                  <stat.icon className="h-6 w-6 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  {stat.title}
                </span>
              </div>
              <div className="mt-2">
                <span
                  className={cn(
                    'text-2xl font-bold',
                    stat.highlight ? 'text-primary-600' : 'text-gray-900'
                  )}
                >
                  {stat.value}
                </span>
                <span className="ml-1 text-sm text-gray-500">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Weekly Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            {days.map((day) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const hasActivity = recentLogs.some((log) => log.date === dayStr);

              return (
                <div key={dayStr} className="flex flex-1 flex-col items-center">
                  <span className="text-sm text-gray-500">
                    {format(day, 'EEE')}
                  </span>
                  <div
                    className={cn(
                      'mt-2 h-8 w-8 rounded-full',
                      hasActivity
                        ? 'bg-primary-600'
                        : 'border-2 border-gray-200',
                      format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                        ? 'ring-2 ring-primary-200'
                        : ''
                    )}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLogs.slice(0, 3).map((log) => (
              <div key={log.date} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary-50 p-2">
                    <Calendar className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {log.routineName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(log.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {Math.round(log.duration / 60)} min
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Utility function to create class names conditionally
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
