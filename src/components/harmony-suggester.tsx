'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import * as React from 'react';
import { Loader, Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { suggestHarmony, type SuggestHarmonyOutput } from '@/ai/flows/suggest-harmony';
import { INSTRUMENTS, MUSICAL_KEYS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  instrument: z.string({
    required_error: 'Please select an instrument.',
  }),
  key: z.string({
    required_error: 'Please select a musical key.',
  }),
});

export function HarmonySuggester() {
  const [isPending, startTransition] = React.useTransition();
  const [result, setResult] = React.useState<SuggestHarmonyOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setResult(null);
    startTransition(async () => {
      try {
        const harmonySuggestion = await suggestHarmony(data);
        setResult(harmonySuggestion);
      } catch (error) {
        console.error('Error fetching harmony suggestions:', error);
        toast({
          title: 'Error',
          description: 'Failed to generate harmony suggestions. Please try again.',
          variant: 'destructive',
        });
      }
    });
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="instrument"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instrument</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an instrument" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INSTRUMENTS.map((inst) => (
                      <SelectItem key={inst.value} value={inst.value}>
                        {inst.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Musical Key</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a key" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MUSICAL_KEYS.map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            {isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Harmony
          </Button>
        </form>
      </Form>

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chord Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-mono bg-muted p-3 rounded-md">{result.chordProgression}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Harmony Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.harmonySuggestions}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
