import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { ExerciseProgress } from '../types';

interface ProgressChartsProps {
  data: ExerciseProgress[];
  weightUnit?: 'kg' | 'lbs';
}

export default function ProgressCharts({
  data,
  weightUnit = 'kg',
}: ProgressChartsProps) {
  // Procesar datos para los gráficos
  const chartData = data.map((progress) => ({
    date: format(parseISO(progress.created_at), 'MMM d'),
    weight: progress.weight_used,
    volume: progress.weight_used * progress.reps_performed,
    reps: progress.reps_performed,
    borg: progress.borg_rating,
  }));

  return (
    <div className="space-y-6">
      {/* Gráfico de Peso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weight Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" fontSize={12} tickMargin={10} />
                <YAxis
                  fontSize={12}
                  tickMargin={10}
                  label={{
                    value: `Weight (${weightUnit})`,
                    angle: -90,
                    position: 'insideLeft',
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name={`Weight (${weightUnit})`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Volumen */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Volume Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" fontSize={12} tickMargin={10} />
                <YAxis
                  fontSize={12}
                  tickMargin={10}
                  label={{
                    value: 'Volume',
                    angle: -90,
                    position: 'insideLeft',
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Volume"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Reps y Borg Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reps & Intensity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" fontSize={12} tickMargin={10} />
                <YAxis
                  yAxisId="left"
                  fontSize={12}
                  tickMargin={10}
                  label={{
                    value: 'Reps',
                    angle: -90,
                    position: 'insideLeft',
                    fontSize: 12,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 10]}
                  fontSize={12}
                  tickMargin={10}
                  label={{
                    value: 'Borg Rating',
                    angle: 90,
                    position: 'insideRight',
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="reps"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Reps"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="borg"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Borg Rating"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
