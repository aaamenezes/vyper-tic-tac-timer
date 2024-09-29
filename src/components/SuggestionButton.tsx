import { Button } from '@/components/ui/button';
import { TimerStateProps } from '../types';
import { Dispatch, SetStateAction } from 'react';

export default function SuggestionButton({
  suggestion,
  timerState,
  setTimeRemaining,
  setTimerState,
}: {
  suggestion: { label: string; time: number };
  timerState: TimerStateProps;
  setTimeRemaining: Dispatch<SetStateAction<number>>;
  setTimerState: Dispatch<SetStateAction<TimerStateProps>>;
}) {
  return (
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
  );
}
