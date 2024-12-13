import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Calendar,
  Activity,
  Trophy,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const [username] = useState('John'); // Replace with actual user data

  const stats = [
    {
      label: 'Workouts',
      value: '10',
      subtext: 'Total completed',
      icon: Calendar,
    },
    { label: 'Streak', value: '5', subtext: 'Current days', icon: Activity },
    { label: 'Training Time', value: '2h', subtext: 'This month', icon: Clock },
    {
      label: 'Achievements',
      value: '3',
      subtext: 'Total earned',
      icon: Trophy,
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {username}!
        </h1>
        <p className="text-gray-600">Ready for your next workout?</p>
      </div>

      {/* Quick Action Card */}
      <Card className="mb-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Start a new workout
              </h2>
              <p className="text-primary-100">
                Choose from your routines or create a new one
              </p>
            </div>
            <button
              onClick={() => navigate('/routines')}
              className="flex items-center gap-2 bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              <Play className="w-4 h-4" />
              Browse Routines
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.subtext}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Activity */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Activity</h2>
          <div className="flex justify-between">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-sm text-gray-500 mb-2">{day}</span>
                <div
                  className={`w-8 h-8 rounded-full border-2 ${
                    i === 3
                      ? 'bg-primary-600 border-primary-600'
                      : 'border-gray-200'
                  }`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent PRs</h2>
            <div className="text-gray-500 text-sm">
              Complete workouts to track your progress
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Volume Distribution</h2>
            <div className="text-gray-500 text-sm">
              Start training to see your volume distribution
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
