import { useState, useCallback } from 'react';
import { Timer, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SessionTimer from './SessionTimer';

interface SessionMultiTimerProps {
  sessionStartTime?: Date;
  restDuration: number;
  onRestComplete?: () => void;
}

export default function SessionMultiTimer({
  sessionStartTime,
  restDuration,
  onRestComplete,
}: SessionMultiTimerProps) {
  const [activeTimer, setActiveTimer] = useState<'session' | 'rest'>('session');

  const getSessionDuration = useCallback(() => {
    if (!sessionStartTime) return 0;
    const now = new Date();
    return Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
  }, [sessionStartTime]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Session Timers</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTimer}
          onValueChange={(v) => setActiveTimer(v as 'session' | 'rest')}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="session" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Session Time
            </TabsTrigger>
            <TabsTrigger value="rest" className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Rest Timer
            </TabsTrigger>
          </TabsList>

          {activeTimer === 'session' && sessionStartTime && (
            <div className="py-2">
              <SessionTimer
                duration={getSessionDuration()}
                autoStart={true}
                showSound={false}
                label="Total Session Time"
              />
            </div>
          )}

          {activeTimer === 'rest' && (
            <div className="py-2">
              <SessionTimer
                duration={restDuration}
                onComplete={onRestComplete}
                showSound={true}
                label="Rest Time"
              />
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
