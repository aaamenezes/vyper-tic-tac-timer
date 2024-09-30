import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { suggestions } from '@/src/data/suggestions';
import useControls from '@/src/hooks/useControls';
import { formatMinutes, formatSeconds } from '@/src/utils/formatTime';
import { RotateCcw } from 'lucide-react';

export default function Home() {
  const {
    timeRemaining,
    timerState,
    startButtonLabel,
    StartButtonIcon,
    handleStartButton,
    setNewTime,
  } = useControls();

  return (
    <main className="grid place-items-center min-h-screen">
      <div className="m-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Viper Tic Tac Timer</CardTitle>
            <CardDescription>Seu timer bonitinho!</CardDescription>
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
                onClick={() => setNewTime(0)}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                <span>Reset</span>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <Button
                variant="outline"
                key={suggestion.label}
                disabled={timerState === 'running'}
                onClick={() => setNewTime(suggestion.time)}
              >
                {suggestion.label}
              </Button>
            ))}
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
