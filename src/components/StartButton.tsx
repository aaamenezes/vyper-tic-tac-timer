import { Button } from '@/components/ui/button';
import { Pause, Play, StepForward } from 'lucide-react';
import { useCallback, type Dispatch, type SetStateAction } from 'react';
import { TimerStateProps } from '../types';

export default function StartButton({
  timerState,
  setTimerState,
  timeRemaining,
}: {
  timerState: TimerStateProps;
  setTimerState: Dispatch<SetStateAction<TimerStateProps>>;
  timeRemaining: number;
}) {
  const handleClick = useCallback(() => {
    setTimerState((currentState) =>
      currentState === 'notStarted' || currentState === 'paused'
        ? 'running'
        : 'paused'
    );
  }, [setTimerState]);

  const startButtonMap: Record<
    TimerStateProps,
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

  return (
    <Button disabled={timeRemaining === 0} onClick={handleClick}>
      {startButtonMap[timerState].icon}
      {startButtonMap[timerState].label}
    </Button>
  );
}
