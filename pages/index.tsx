import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { suggestions } from '@/src/data/suggestions';
import useControls from '@/src/hooks/useControls';
import { formatMinutes, formatSeconds } from '@/src/utils/formatTime';
import { CircleCheckBig, RotateCcw, Settings } from 'lucide-react';

export default function Home() {
  const {
    timeRemaining,
    lastSetTimer,
    timerState,
    startButtonLabel,
    StartButtonIcon,
    hasFinishSound,
    hasTicSound,
    handleStartButton,
    setNewTime,
    handleFinishSound,
    handleTicSound,
  } = useControls();

  return (
    <main className="grid place-items-center min-h-screen">
      <div className="m-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-row justify-between">
            <div>
              <CardTitle>Vyper Tic Tac Timer</CardTitle>
              <CardDescription>Your beautiful timer</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" aria-label="abrir configurações">
                  <Settings />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Configuration</DialogTitle>
                  <DialogDescription className="mt-4">
                    Turn yout Vyper Tictac Timer better
                  </DialogDescription>

                  <div className="flex items-center gap-2 mb-3 cursor-pointer">
                    <Checkbox
                      id="tictac-sound"
                      checked={hasTicSound}
                      onClick={() => handleTicSound(!hasTicSound)}
                    />
                    <Label htmlFor="tictac-sound" className=" cursor-pointer">
                      Active tictac sound
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      id="finish-sound"
                      checked={hasFinishSound}
                      onClick={() => handleFinishSound(!hasFinishSound)}
                    />
                    <Label htmlFor="finish-sound" className=" cursor-pointer">
                      Active finish sound
                    </Label>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
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
            {suggestions.map((suggestion) => (
              <Button
                variant={
                  suggestion.time === lastSetTimer ? 'secondary' : 'outline'
                }
                aria-selected={suggestion.time === lastSetTimer}
                key={suggestion.label}
                disabled={timerState === 'running'}
                onClick={() => setNewTime(suggestion.time)}
              >
                {suggestion.label}
                {suggestion.time === lastSetTimer && (
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
