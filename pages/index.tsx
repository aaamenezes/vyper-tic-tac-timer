import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, StepForward } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { suggestions } from '@/src/data/suggestions';
import { formatMinutes, formatSeconds } from '@/src/utils/formatTime';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

function useWithSound(audioPath: string) {
  const soundRef: MutableRefObject<HTMLAudioElement | null> = useRef(null);

  const play = useCallback(() => soundRef.current?.play(), []);

  useEffect(() => {
    soundRef.current = new Audio(audioPath);
  }, [audioPath]);

  return { play };
}

export default function Home() {
  const [timerState, setTimerState] = useState<
    'notStarted' | 'running' | 'paused'
  >('notStarted');
  const [timeRemaining, setTimeRemaining] = useState(300);

  const timeout: MutableRefObject<NodeJS.Timeout | null> = useRef(null);

  const { play: playTic } = useWithSound('/tic.wav');
  const { play: playFinish } = useWithSound('/finish.wav');

  const startButtonMap: Record<
    typeof timerState,
    { icon: JSX.Element; label: JSX.Element }
  > = {
    notStarted: {
      icon: <Play className="mr-2 h-4 w-4" />,
      label: <span>Start</span>,
    },
    running: {
      icon: <Pause className="mr-2 h-4 w-4" />,
      label: <span>Pause</span>,
    },
    paused: {
      icon: <StepForward className="mr-2 h-4 w-4" />,
      label: <span>Continue</span>,
    },
  };

  useEffect(() => {
    if (timerState === 'running') {
      if (timeRemaining > 0) {
        if (timeout.current) clearInterval(timeout.current);
        timeout.current = setTimeout(() => {
          if (timeRemaining > 1) playTic();
          setTimeRemaining((timeRemaining) => timeRemaining - 1);
        }, 1000);
      } else {
        setTimerState('notStarted');
        playFinish();
      }
    }

    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [timeRemaining, timerState, playFinish, playTic]);

  return (
    <main className="grid place-items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Viper Tic Tac Timer</CardTitle>
          <CardDescription>Seu timer bonitinho!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <h2 className="text-4xl text-center font-mono">
            <audio src="/tic1.wav" />
            {formatMinutes(timeRemaining)}:{formatSeconds(timeRemaining)}
          </h2>
          <div className="flex gap-2">
            <Button
              disabled={timeRemaining === 0}
              onClick={() =>
                setTimerState((currentState) =>
                  currentState === 'notStarted' || currentState === 'paused'
                    ? 'running'
                    : 'paused'
                )
              }
            >
              {startButtonMap[timerState].icon}
              {startButtonMap[timerState].label}
            </Button>
            <Button
              disabled={timerState === 'notStarted'}
              onClick={() => {
                setTimeRemaining(0);
                setTimerState('notStarted');
                if (timeout.current) clearInterval(timeout.current);
              }}
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
              onClick={() => {
                setTimeRemaining(suggestion.time);
                setTimerState('notStarted');
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
