import { ForwardRefExoticComponent, RefAttributes, useCallback, useEffect, useRef, useState } from "react"
import { TimerStateProps, TimerTimeoutProps } from "../types";
import useSounds from "./useSounds";
import JSConfetti from "js-confetti";
import { Play, Pause, StepForward } from "lucide-react";
import type { LucideProps } from "lucide-react";

type ButtonIconProps = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>

export default function useControls() {
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [timerState, setTimerState] = useState<TimerStateProps>('notStarted');
  const [startButtonLabel, setStartButtonLabel] = useState("Start")
  const [StartButtonIcon, setStartButtonIcon] = useState<ButtonIconProps>(Play)

  const { play: playTic } = useSounds('/tic.wav');
  const { play: playFinish } = useSounds('/finish.wav');

  const timerTimeout: TimerTimeoutProps = useRef(null);

  const stopTimeout = useCallback(() => {
    if (timerTimeout.current) clearTimeout(timerTimeout.current);
  }, [])

  const handleStartButton = useCallback(() => {
    stopTimeout()

    if (timerState === 'paused' || timerState === 'notStarted') {
      setTimerState('running')
      setStartButtonLabel('Pause')
      setStartButtonIcon(Pause);
      return
    }

    setTimerState('paused')
    setStartButtonLabel('Continue')
    setStartButtonIcon(StepForward);
  }, [stopTimeout, timerState])

  const setNewTime = useCallback((time: number) => {
    stopTimeout()
    setTimeRemaining(time);
    setTimerState('notStarted');
    setStartButtonLabel('Start');
    setStartButtonIcon(Play);
  }, [stopTimeout])

  useEffect(() => {
    if (timerState === 'running') {
      if (timeRemaining > 0) {
        stopTimeout()
        timerTimeout.current = setTimeout(() => {
          if (timeRemaining > 1) playTic();
          setTimeRemaining((timeRemaining) => timeRemaining - 1);
        }, 1000);
      } else {
        setTimerState('notStarted');
        setStartButtonLabel('Start');
        setStartButtonIcon(Play);
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
      stopTimeout()
    };
  }, [stopTimeout, timeRemaining, timerState, playFinish, playTic]);

  return { timeRemaining, timerState, startButtonLabel, StartButtonIcon, handleStartButton, setNewTime }
}