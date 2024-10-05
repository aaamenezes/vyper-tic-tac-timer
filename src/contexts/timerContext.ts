import { createContext } from 'react';
import {
  ButtonIconProps,
  PresetProps,
  StartButtonLabelProps,
  TimerStateProps,
} from '../type';

interface TimerContextProps {
  timeRemaining: number;
  lastSetTimer: number;
  timerState: TimerStateProps;
  startButtonLabel: StartButtonLabelProps;
  StartButtonIcon: ButtonIconProps;
  presets: PresetProps[];
  hasFinishSound: boolean;
  hasTicSound: boolean;
  handleStartButton: () => void;
  setNewTime: (time: number) => void;
  handleFinishSound: (state: boolean) => void;
  handleTicSound: (state: boolean) => void;
  removePreset: (time: number) => void;
}

const TimerContext = createContext({} as TimerContextProps);

export default TimerContext;
