import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export type PresetProps = {
  label: string;
  time: number;
};

export type StartButtonLabelProps = 'Start' | 'Pause' | 'Continue';

export type TimerStateProps = 'notStarted' | 'running' | 'paused';

export type ButtonIconProps = ForwardRefExoticComponent<
  Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>;
