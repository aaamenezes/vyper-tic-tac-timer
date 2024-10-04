import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ForwardRefExoticComponent,
  MutableRefObject,
  RefAttributes,
} from 'react';
import useSounds from './useSounds';
import JSConfetti from 'js-confetti';
import { Play, Pause, StepForward } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

type TimerStateProps = 'notStarted' | 'running' | 'paused';
type TimerTimeoutProps = MutableRefObject<NodeJS.Timeout | null>;
type ButtonIconProps = ForwardRefExoticComponent<
  Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>;

export default function useControls() {
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [lastSetTimer, setLastSetTimer] = useState(300);
  const [timerState, setTimerState] = useState<TimerStateProps>('notStarted');
  const [startButtonLabel, setStartButtonLabel] = useState('Start');
  const [StartButtonIcon, setStartButtonIcon] = useState<ButtonIconProps>(Play);
  const [hasTicSound, setHasTicSound] = useState(true);
  const [hasFinishSound, setHasFinishSound] = useState(true);

  const { play: playTic } = useSounds('/tic.wav');
  const { play: playFinish } = useSounds('/finish.mp3');

  const timerTimeout: TimerTimeoutProps = useRef(null);

  const stopTimeout = useCallback(() => {
    if (timerTimeout.current) clearTimeout(timerTimeout.current);
  }, []);

  const handleStartButton = useCallback(() => {
    stopTimeout();

    if (timerState === 'paused' || timerState === 'notStarted') {
      setTimerState('running');
      setStartButtonLabel('Pause');
      setStartButtonIcon(Pause);
      return;
    }

    setTimerState('paused');
    setStartButtonLabel('Continue');
    setStartButtonIcon(StepForward);
  }, [stopTimeout, timerState]);

  const setNewTime = useCallback(
    (time: number) => {
      stopTimeout();
      setTimeRemaining(time);
      setLastSetTimer(time);
      setTimerState('notStarted');
      setStartButtonLabel('Start');
      setStartButtonIcon(Play);
    },
    [stopTimeout]
  );

  const handleTicSound = useCallback((state: boolean) => {
    setHasTicSound(state);
    if (window) {
      window.localStorage.setItem('vyper.hasTicSound', state.toString());
    }
  }, []);

  const handleFinishSound = useCallback((state: boolean) => {
    setHasFinishSound(state);
    if (window) {
      window.localStorage.setItem('vyper.hasFinishSound', state.toString());
    }
  }, []);

  useEffect(() => {
    if (!window) return;

    const initialHasTicSound = window.localStorage.getItem('vyper.hasTicSound');
    if (initialHasTicSound) {
      setHasTicSound(initialHasTicSound === 'true');
    } else {
      window.localStorage.setItem('vyper.hasTicSound', 'true');
    }

    const initialHasFinishSound = window.localStorage.getItem(
      'vyper.hasFinishSound'
    );
    if (initialHasFinishSound) {
      setHasFinishSound(initialHasFinishSound === 'true');
    } else {
      window.localStorage.setItem('vyper.hasFinishSound', 'true');
    }
  }, []);

  useEffect(() => {
    stopTimeout();

    if (timerState === 'running') {
      if (timeRemaining > 0) {
        timerTimeout.current = setTimeout(() => {
          if (timeRemaining > 1 && hasTicSound) playTic();
          setTimeRemaining((timeRemaining) => timeRemaining - 1);
        }, 1000);
      } else {
        setTimeRemaining(lastSetTimer);
        setTimerState('notStarted');
        setStartButtonLabel('Start');
        setStartButtonIcon(Play);
        if (hasFinishSound) playFinish();

        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti({
          emojis: [
            '💿',
            '💻',
            '⌨️',
            '🎮',
            '🛜',
            '💾',
            '🖥️',
            '🐥',
            '👩‍💻',
            '👨‍💻',
            '🦧',
            '🙈',
          ],
          emojiSize: 50,
          confettiNumber: 100,
        });
      }
    }

    return () => {
      stopTimeout();
    };
  }, [
    timeRemaining,
    timerState,
    hasTicSound,
    hasFinishSound,
    lastSetTimer,
    stopTimeout,
    playFinish,
    playTic,
  ]);

  return {
    timeRemaining,
    lastSetTimer,
    timerState,
    startButtonLabel,
    StartButtonIcon,
    hasTicSound,
    hasFinishSound,
    handleStartButton,
    setNewTime,
    handleTicSound,
    handleFinishSound,
  };
}
