import JSConfetti from 'js-confetti';
import { Pause, Play, StepForward } from 'lucide-react';
import {
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import useSounds from '../hooks/useSounds';
import {
  ButtonIconProps,
  PresetProps,
  StartButtonLabelProps,
  TimerStateProps,
} from '../type';
import TimerContext from './timerContext';

type TimerTimeoutProps = MutableRefObject<NodeJS.Timeout | null>;

export default function TimerProvider({ children }: PropsWithChildren) {
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [lastSetTimer, setLastSetTimer] = useState(300);
  const [timerState, setTimerState] = useState<TimerStateProps>('notStarted');
  const [startButtonLabel, setStartButtonLabel] =
    useState<StartButtonLabelProps>('Start');
  const [StartButtonIcon, setStartButtonIcon] = useState<ButtonIconProps>(Play);
  const [hasTicSound, setHasTicSound] = useState(true);
  const [hasFinishSound, setHasFinishSound] = useState(true);
  const [presets, setPresets] = useState<PresetProps[]>([]);

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

  const removePreset = useCallback(
    (time: number) => {
      const newPresets = presets.filter((preset) => preset.time !== time);

      setPresets(newPresets);

      if (window) {
        window.localStorage.setItem(
          'vyper.presets',
          JSON.stringify(newPresets)
        );
      }
    },
    [presets]
  );

  useEffect(() => {
    if (!window) return;

    const initialHasTicSoundFromLocalStorage =
      window.localStorage.getItem('vyper.hasTicSound');
    if (initialHasTicSoundFromLocalStorage) {
      setHasTicSound(initialHasTicSoundFromLocalStorage === 'true');
    } else {
      window.localStorage.setItem('vyper.hasTicSound', 'true');
    }

    const initialHasFinishSoundFromLocalStorage = window.localStorage.getItem(
      'vyper.hasFinishSound'
    );
    if (initialHasFinishSoundFromLocalStorage) {
      setHasFinishSound(initialHasFinishSoundFromLocalStorage === 'true');
    } else {
      window.localStorage.setItem('vyper.hasFinishSound', 'true');
    }

    const initialPresetsFromLocalStorage =
      window.localStorage.getItem('vyper.presets');
    if (
      initialPresetsFromLocalStorage &&
      initialPresetsFromLocalStorage !== '[]'
    ) {
      setPresets(JSON.parse(initialPresetsFromLocalStorage));
    } else {
      const initialPresets = [
        { label: '1sec', time: 1 },
        { label: '5sec', time: 5 },
        { label: '1min', time: 60 },
        { label: '5min', time: 300 },
        { label: '10min', time: 600 },
        { label: '15min', time: 900 },
        { label: '20min', time: 1200 },
        { label: '25min', time: 1500 },
        { label: '30min', time: 1800 },
        { label: '45min', time: 2700 },
        { label: '60min', time: 3600 },
      ];

      setPresets(initialPresets);
      window.localStorage.setItem(
        'vyper.presets',
        JSON.stringify(initialPresets)
      );
    }
  }, []);

  useEffect(() => {
    if (timerState === 'running') {
      if (timeRemaining > 0) {
        stopTimeout();
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
          emojiSize: 70,
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

  return (
    <TimerContext.Provider
      value={{
        timeRemaining,
        lastSetTimer,
        timerState,
        startButtonLabel,
        StartButtonIcon,
        hasTicSound,
        hasFinishSound,
        presets,
        handleStartButton,
        setNewTime,
        handleTicSound,
        handleFinishSound,
        removePreset,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}
