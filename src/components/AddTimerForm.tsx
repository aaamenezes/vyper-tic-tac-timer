import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTimerContext } from '../hooks/useTimerContext';
import { Toaster } from './ui/toaster';
import { useToast } from '../hooks/use-toast';

export default function AddTimerForm() {
  const { addPreset, presetAlreadyExists } = useTimerContext();
  const defaultValues = useMemo(
    () => ({
      label: '',
      time: 0,
    }),
    []
  );

  const { toast } = useToast();

  const labelInputRef = useRef<HTMLInputElement>(null);

  const addTimerSchema = z.object({
    label: z
      .string()
      .min(1, { message: 'Must be at least 1 character' })
      .max(30, { message: 'Must be less than 30 characters' })
      .trim(),
    time: z
      .number()
      .min(1, { message: 'Must be at least 1 second' })
      .positive({ message: 'Must be a positive number' }),
  });

  const form = useForm<z.infer<typeof addTimerSchema>>({
    resolver: zodResolver(addTimerSchema),
    defaultValues,
  });

  const handleSubmit = useCallback(
    (values: z.infer<typeof addTimerSchema>) => {
      if (presetAlreadyExists(values)) {
        toast({
          title: 'This preset already exists',
          description: 'You already have a preset with this label and time',
        });
        return;
      }

      addPreset(values);
      form.reset();
      labelInputRef.current?.focus();
    },
    [presetAlreadyExists, toast, addPreset, form]
  );

  return (
    <div>
      <h3 className="scroll-m-20 text-md font-semibold tracking-tight mb-2">
        Add timer
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Label</FormLabel>
                  <FormControl>
                    <Input
                      ref={labelInputRef}
                      placeholder="example: 10 minutes, pomodoro..."
                      disabled={field.disabled}
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Text displayed on your preset timer
                  </FormDescription>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Time</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="example: 60, 600..."
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                      ref={field.ref}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Time remaining for this preset in seconds
                  </FormDescription>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <Toaster />
    </div>
  );
}
