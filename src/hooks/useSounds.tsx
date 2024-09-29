import { useCallback, useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';

export default function useSounds(audioPath: string) {
  const soundRef: MutableRefObject<HTMLAudioElement | null> = useRef(null);

  const play = useCallback(() => soundRef.current?.play(), []);

  useEffect(() => {
    soundRef.current = new Audio(audioPath);
  }, [audioPath]);

  return { play };
}
