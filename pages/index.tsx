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
        <Card className="w-[90vw] max-w-[420px] max-h-[90vh]">
          <CardHeader className="flex flex-row justify-between gap-4">
            <div>
              <CardTitle className="mb-2">Vyper Tic Tac Timer</CardTitle>
              <CardDescription>Your beautiful timer</CardDescription>
            </div>
            <Config />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <h2 className="text-5xl text-center font-mono">
              {formatMinutes(timeRemaining)}:{formatSeconds(timeRemaining)}
            </h2>
            <div className="flex justify-center gap-2">
              <Button
                disabled={timeRemaining === 0}
                onClick={handleStartButton}
                className="h-fit py-2 px-4"
              >
                <StartButtonIcon className="w-4 h-4 mr-2" />
                <span className="text-lg">{startButtonLabel}</span>
              </Button>
              <Button
                disabled={timerState === 'notStarted'}
                onClick={() => setNewTime(lastSetTimer)}
                className="h-fit py-2 px-4"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                <span className="text-lg">Restart</span>
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
