import { useContext } from 'react';
import TimerContext from '../contexts/timerContext';

export function useTimerContext() {
  return useContext(TimerContext);
}
