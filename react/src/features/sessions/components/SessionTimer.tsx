import { useEffect, useCallback, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface SessionTimerProps {
  duration: number;
  onComplete?: () => void;
  autoStart?: boolean;
  showSound?: boolean;
  label?: string;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const DEFAULT_SOUND_ENABLED = true;
const ALERT_THRESHOLDS = [60, 30, 10, 5]; // Segundos cuando sonar alerta

export default function SessionTimer({
  duration,
  onComplete,
  autoStart = false,
  showSound = true,
  label,
}: SessionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [hasStarted, setHasStarted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useLocalStorage(
    'timerSound',
    DEFAULT_SOUND_ENABLED
  );

  // Preparar sonidos
  useEffect(() => {
    const timerBeep = new Audio('/sounds/timer-beep.mp3');
    const timerComplete = new Audio('/sounds/timer-complete.mp3');

    const playSound = (sound: HTMLAudioElement) => {
      if (soundEnabled) {
        sound.play().catch(() => {
          // Manejar error de reproducción silenciosamente
        });
      }
    };

    // Observar thresholds y fin del timer
    if (isRunning && soundEnabled) {
      if (ALERT_THRESHOLDS.includes(timeLeft)) {
        playSound(timerBeep);
      } else if (timeLeft === 0) {
        playSound(timerComplete);
      }
    }
  }, [timeLeft, isRunning, soundEnabled]);

  const reset = useCallback(() => {
    setTimeLeft(duration);
    setIsRunning(false);
    setHasStarted(false);
  }, [duration]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
    if (!hasStarted) {
      setHasStarted(true);
    }
  }, [hasStarted]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, [setSoundEnabled]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  // Calcular progreso
  const progress = ((duration - timeLeft) / duration) * 100;
  // Determinar color basado en el tiempo restante
  const getProgressColor = () => {
    if (timeLeft <= 10) return 'stroke-red-500';
    if (timeLeft <= 30) return 'stroke-yellow-500';
    return 'stroke-primary-500';
  };

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          {label && (
            <h3 className="text-lg font-medium text-gray-700">{label}</h3>
          )}

          {/* Timer Display */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Circular Progress */}
            <svg className="absolute w-full h-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                className="stroke-gray-200"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="58"
                className={`transition-all duration-300 ${getProgressColor()}`}
                strokeWidth="8"
                fill="none"
                strokeDasharray={364}
                strokeDashoffset={364 - (364 * progress) / 100}
              />
            </svg>
            {/* Time Display */}
            <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={toggleTimer}
              variant={isRunning ? 'secondary' : 'primary'}
              className="w-24"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>

            {hasStarted && (
              <Button onClick={reset} variant="secondary" className="w-24">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}

            {showSound && (
              <Button
                onClick={toggleSound}
                variant="ghost"
                className="w-10 px-0"
                title={soundEnabled ? 'Disable sound' : 'Enable sound'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>

          {/* Tiempo restante en texto (opcional para mejor accesibilidad) */}
          <p className="text-sm text-gray-500">
            {timeLeft > 0 ? `${formatTime(timeLeft)} remaining` : "Time's up!"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
