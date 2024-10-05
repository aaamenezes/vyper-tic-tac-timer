import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Config from '@/src/components/Config';
import { useTimerContext } from '@/src/hooks/useTimerContext';
import { formatMinutes, formatSeconds } from '@/src/utils/formatTime';
import { CircleCheckBig, RotateCcw } from 'lucide-react';

export default function Home() {
  const {
    timeRemaining,
    lastSetTimer,
    timerState,
    startButtonLabel,
    StartButtonIcon,
    presets,
    handleStartButton,
    setNewTime,
  } = useTimerContext();

  return (
    <main className="grid place-items-center min-h-screen">
      <div className="m-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-row justify-between">
            <div>
              <CardTitle>Vyper Tic Tac Timer</CardTitle>
              <CardDescription>Your beautiful timer</CardDescription>
            </div>
            <Config />
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <h2 className="text-4xl text-center font-mono">
              {formatMinutes(timeRemaining)}:{formatSeconds(timeRemaining)}
            </h2>
            <div className="flex gap-2">
              <Button
                disabled={timeRemaining === 0}
                onClick={handleStartButton}
              >
                <StartButtonIcon className="w-4 h-4 mr-2" />
                <span>{startButtonLabel}</span>
              </Button>
              <Button
                disabled={timerState === 'notStarted'}
                onClick={() => setNewTime(lastSetTimer)}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                <span>Restart</span>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Button
                variant={preset.time === lastSetTimer ? 'secondary' : 'outline'}
                aria-selected={preset.time === lastSetTimer}
                key={preset.label}
                disabled={timerState === 'running'}
                onClick={() => setNewTime(preset.time)}
              >
                {preset.label}
                {preset.time === lastSetTimer && (
                  <CircleCheckBig className="w-4 h-4 ml-2" />
                )}
              </Button>
            ))}
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
