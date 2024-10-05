import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Settings, X } from 'lucide-react';
import { useTimerContext } from '../hooks/useTimerContext';

export default function Config() {
  const {
    lastSetTimer,
    timerState,
    hasFinishSound,
    hasTicSound,
    presets,
    handleFinishSound,
    handleTicSound,
    removePreset,
  } = useTimerContext();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" aria-label="abrir configurações">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] gap-8">
        <DialogHeader>
          <DialogTitle>Configuration</DialogTitle>
          <DialogDescription className="mt-4">
            Turn your Vyper Tictac Timer better
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex items-center gap-2 mb-3 cursor-pointer">
            <Checkbox
              id="tictac-sound"
              checked={hasTicSound}
              onClick={() => handleTicSound(!hasTicSound)}
            />
            <Label htmlFor="tictac-sound" className=" cursor-pointer">
              Active tictac sound
            </Label>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              id="finish-sound"
              checked={hasFinishSound}
              onClick={() => handleFinishSound(!hasFinishSound)}
            />
            <Label htmlFor="finish-sound" className=" cursor-pointer">
              Active finish sound
            </Label>
          </div>
        </div>
        <div>
          <h3 className="scroll-m-20 text-md font-semibold tracking-tight mb-2">
            Timers
          </h3>
          <ul className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <li key={preset.label}>
                <Button
                  variant="outline"
                  aria-selected={preset.time === lastSetTimer}
                  disabled={timerState === 'running'}
                  onClick={() => removePreset(preset.time)}
                  className="group"
                >
                  {preset.label}
                  <X className="w-4 h-4 ml-2 invisible group-hover:visible" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
