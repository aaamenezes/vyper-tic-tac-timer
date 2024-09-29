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
import { useEffect, useRef, useState } from 'react';
import useSounds from '@/src/hooks/useSounds';
import StartButton from '@/src/components/StartButton';
import ResetButton from '@/src/components/ResetButton';
import { TimerStateProps, TimerTimeoutProps } from '@/src/types';
import SuggestionButton from '@/src/components/SuggestionButton';
import JSConfetti from 'js-confetti';

export default function Home() {
  const [timerState, setTimerState] = useState<TimerStateProps>('notStarted');
  const [timeRemaining, setTimeRemaining] = useState(300);

  const timerTimeout: TimerTimeoutProps = useRef(null);

  const { play: playTic } = useSounds('/tic.wav');
  const { play: playFinish } = useSounds('/finish.wav');

  useEffect(() => {
    if (timerState === 'running') {
      if (timeRemaining > 0) {
        if (timerTimeout.current) clearTimeout(timerTimeout.current);
        timerTimeout.current = setTimeout(() => {
          if (timeRemaining > 1) playTic();
          setTimeRemaining((timeRemaining) => timeRemaining - 1);
        }, 1000);
      } else {
        setTimerState('notStarted');
        playFinish();

        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti({
          emojis: ['💿', '💻', '⌨️', '🎮', '🛜', '💾', '🖥️', '🐥', '👩‍💻', '👨‍💻'],
          emojiSize: 80,
          confettiNumber: 200,
        });
      }
    }

    return () => {
      if (timerTimeout.current) clearTimeout(timerTimeout.current);
    };
  }, [timeRemaining, timerState, playFinish, playTic]);

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
              <StartButton
                timerState={timerState}
                setTimerState={setTimerState}
                timeRemaining={timeRemaining}
              />
              <ResetButton
                timerState={timerState}
                setTimerState={setTimerState}
                setTimeRemaining={setTimeRemaining}
                timerTimeout={timerTimeout}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <SuggestionButton
                suggestion={suggestion}
                key={suggestion.label}
                timerState={timerState}
                setTimeRemaining={setTimeRemaining}
                setTimerState={setTimerState}
              />
            ))}
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
