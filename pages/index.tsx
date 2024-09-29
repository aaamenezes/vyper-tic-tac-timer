import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { suggestions } from '@/src/suggestions';
import { MutableRefObject, useCallback, useRef, useState } from 'react';

export default function Home() {
  const [timerState, setTimerState] = useState<
    'notStarted' | 'running' | 'paused'
  >('notStarted');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  const interval: MutableRefObject<NodeJS.Timeout | null> = useRef(null);

  const updateMinutes = useCallback(() => {
    if (minutes === '00') return;

    setMinutes((currentMinute) => {
      const numberSecond = Number(currentMinute);
      const newSecond = numberSecond - 1;
      return `0${newSecond}`.slice(-2);
    });
  }, [minutes]);

  const updateSeconds = useCallback(() => {
    if (seconds === '00') {
      if (minutes !== '00') setSeconds('59');
      updateMinutes();
      return;
    }

    setSeconds((currentSecond) => {
      const numberSecond = Number(currentSecond);
      const newSecond = numberSecond - 1;
      return `0${newSecond}`.slice(-2);
    });
  }, [minutes, seconds, updateMinutes, setSeconds]);

  const startTimer = useCallback(() => {
    setTimerState('running');

    if (interval.current) clearInterval(interval.current);

    interval.current = setInterval(() => {
      updateSeconds();
      console.log('🔴🔴🔴 interval');
      console.log(`minutes:`, minutes);
      console.log(`seconds:`, seconds);

      if (minutes === '00' && seconds === '01' && interval.current) {
        clearInterval(interval.current);
        setTimerState('notStarted');
      }
    }, 1000);
  }, [minutes, seconds, updateSeconds]);

  return (
    <main className="grid place-items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Viper Tic Tac Timer</CardTitle>
          <CardDescription>Seu timer bonitinho!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <h2 className="text-4xl text-center font-mono">
            {minutes}:{seconds}
          </h2>
          <div className="flex gap-2">
            <Button
              disabled={minutes === '00' && seconds === '00'}
              onClick={() => {
                startTimer();
                setTimerState(
                  timerState === 'notStarted'
                    ? 'running'
                    : timerState === 'running'
                    ? 'paused'
                    : 'notStarted'
                );
              }}
            >
              {timerState === 'notStarted'
                ? 'Start'
                : timerState === 'running'
                ? 'Pause'
                : 'Continue'}
            </Button>
            <Button
              disabled={timerState === 'notStarted'}
              onClick={() => {
                setMinutes('00');
                setSeconds('00');
                setTimerState('notStarted');
                if (interval.current) clearInterval(interval.current);
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <Button
              variant="outline"
              key={suggestion.label}
              disabled={timerState === 'running'}
              onClick={() => {
                setMinutes(suggestion.time.minutes);
                setSeconds(suggestion.time.seconds);
              }}
            >
              {suggestion.label}
            </Button>
          ))}
        </CardFooter>
      </Card>
    </main>
  );
}
