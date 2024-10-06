import JSConfetti from 'js-confetti';
import { Pause, Play, StepForward } from 'lucide-react';
import {
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useSounds from '../hooks/useSounds';
import {
  ButtonIconProps,
  PresetProps,
  StartButtonLabelProps,
  TimerStateProps,
} from '../types';
import TimerContext from './timerContext';

type TimerTimeoutProps = MutableRefObject<NodeJS.Timeout | null>;

export default function TimerProvider({ children }: PropsWithChildren) {
  const defautPresets = useMemo(
    () => [
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
    ],
    []
  );

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

  const handleLocalStorage = useCallback(
    (method: 'getItem' | 'setItem', key: string, value = '') => {
      if (!window) return;
      return window.localStorage[method](key, value);
    },
    []
  );
  const handleTicSound = useCallback(
    (state: boolean) => {
      setHasTicSound(state);
      handleLocalStorage('setItem', 'vyper.hasTicSound', state.toString());
    },
    [handleLocalStorage]
  );

  const handleFinishSound = useCallback(
    (state: boolean) => {
      setHasFinishSound(state);
      handleLocalStorage('setItem', 'vyper.hasFinishSound', state.toString());
    },
    [handleLocalStorage]
  );

  const removePreset = useCallback(
    (time: number) => {
      const newPresets = presets.filter((preset) => preset.time !== time);

      setPresets(newPresets);
      handleLocalStorage(
        'setItem',
        'vyper.presets',
        JSON.stringify(newPresets)
      );
    },
    [presets, handleLocalStorage]
  );

  const addPreset = useCallback(
    (preset: PresetProps) => {
      const newPresets = [...presets, preset].sort((a, b) => a.time - b.time);
      setPresets(newPresets);
      handleLocalStorage(
        'setItem',
        'vyper.presets',
        JSON.stringify(newPresets)
      );
    },
    [presets, handleLocalStorage]
  );

  const resetPresets = useCallback(() => {
    setPresets(defautPresets);

    handleLocalStorage(
      'setItem',
      'vyper.presets',
      JSON.stringify(defautPresets)
    );
  }, [defautPresets, handleLocalStorage]);

  const presetAlreadyExists = useCallback(
    (preset: PresetProps) =>
      presets.some(
        (currentPreset) =>
          currentPreset.label === preset.label &&
          currentPreset.time === preset.time
      ),
    [presets]
  );

  useEffect(() => {
    if (!window) return;

    const initialHasTicSoundFromLocalStorage = handleLocalStorage(
      'getItem',
      'vyper.hasTicSound'
    );

    if (initialHasTicSoundFromLocalStorage) {
      setHasTicSound(initialHasTicSoundFromLocalStorage === 'true');
    } else {
      handleLocalStorage('setItem', 'vyper.hasTicSound', 'true');
    }

    const initialHasFinishSoundFromLocalStorage = handleLocalStorage(
      'getItem',
      'vyper.hasFinishSound'
    );

    if (initialHasFinishSoundFromLocalStorage) {
      setHasFinishSound(initialHasFinishSoundFromLocalStorage === 'true');
    } else {
      handleLocalStorage('setItem', 'vyper.hasFinishSound', 'true');
    }

    const initialPresetsFromLocalStorage = handleLocalStorage(
      'getItem',
      'vyper.presets'
    );

    if (
      initialPresetsFromLocalStorage &&
      initialPresetsFromLocalStorage !== '[]'
    ) {
      setPresets(JSON.parse(initialPresetsFromLocalStorage));
    } else {
      setPresets(defautPresets);
      window.localStorage.setItem(
        'vyper.presets',
        JSON.stringify(defautPresets)
      );
    }
  }, [defautPresets, handleLocalStorage]);

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
        addPreset,
        resetPresets,
        presetAlreadyExists,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}
