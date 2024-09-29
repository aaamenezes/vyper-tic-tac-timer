import { Button } from '@/components/ui/button';
import { TimerStateProps, TimerTimeoutProps } from '../types';
import type { Dispatch, SetStateAction } from 'react';
import { RotateCcw } from 'lucide-react';

export default function ResetButton({
  timerState,
  setTimerState,
  setTimeRemaining,
  timerTimeout,
}: {
  timerState: TimerStateProps;
  setTimerState: Dispatch<SetStateAction<TimerStateProps>>;
  setTimeRemaining: Dispatch<SetStateAction<number>>;
  timerTimeout: TimerTimeoutProps;
}) {
  return (
    <Button
      disabled={timerState === 'notStarted'}
      onClick={() => {
        setTimeRemaining(0);
        setTimerState('notStarted');
        if (timerTimeout.current) clearInterval(timerTimeout.current);
      }}
    >
      <RotateCcw className="mr-2 h-4 w-4" />
      <span>Reset</span>
    </Button>
  );
}
