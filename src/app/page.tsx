'use client';

import * as React from 'react';
import {
  Keyboard,
  Music,
  Rewind,
  Play,
  Pause,
  OctagonX,
  Volume2,
  VolumeX,
  Sparkles,
  Loader,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSound, type InstrumentName } from '@/hooks/use-sound';
import { Piano } from '@/components/piano';
import { HarmonySuggester } from '@/components/harmony-suggester';
import { KEYBOARD_MAPPING, INSTRUMENTS } from '@/lib/constants';
import { Logo } from '@/components/icons';
import { cn } from '@/lib/utils';

export default function Home() {
  const [octave, setOctave] = React.useState(4);
  const [activeNotes, setActiveNotes] = React.useState<string[]>([]);
  const {
    isLoaded,
    isPlayingDemo,
    isMuted,
    playNote,
    stopNote,
    setInstrument,
    playDemo,
    stopDemo,
    toggleMute,
    initializeAudio,
  } = useSound();
  const [audioInitialized, setAudioInitialized] = React.useState(false);

  const handleInitializeAudio = async () => {
    await initializeAudio();
    setAudioInitialized(true);
  };

  if (!audioInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <Logo className="w-24 h-24 text-primary mb-6" />
        <h1 className="text-4xl font-headline mb-2">Welcome to Sanctuary Sounds</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          An immersive musical experience for exploring sacred harmonies. Click below to enable audio and begin your composition.
        </p>
        <Button onClick={handleInitializeAudio} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Volume2 className="mr-2 h-5 w-5" />
          Enable Audio
        </Button>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center">
        <Loader className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground mt-4">Loading Instruments...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-4 lg:p-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 max-w-screen-2xl mx-auto">
        <header className="xl:col-span-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-2xl font-bold font-headline">Sanctuary Sounds</h1>
              <p className="text-sm text-muted-foreground">A tool for sacred music composition</p>
            </div>
          </div>
          <Button onClick={toggleMute} variant="ghost" size="icon">
            {isMuted ? <VolumeX /> : <Volume2 />}
            <span className="sr-only">Toggle Mute</span>
          </Button>
        </header>

        <div className="xl:col-span-8 flex flex-col gap-6">
          <Card className="rounded-xl overflow-hidden shadow-lg border-2 border-border">
            <CardContent className="p-4 md:p-6">
              <Piano
                octave={octave}
                playNote={playNote}
                stopNote={stopNote}
                activeNotes={activeNotes}
                setActiveNotes={setActiveNotes}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Keyboard /> Keyboard Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {Object.entries(KEYBOARD_MAPPING).map(([key, note]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="font-mono bg-muted px-2 py-1 rounded-md">{key.toUpperCase()}</span>
                    <span>-&gt;</span>
                    <span className="font-semibold">{note}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Music /> Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Instrument</label>
                <Select
                  defaultValue="piano"
                  onValueChange={(value: InstrumentName) => setInstrument(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an instrument" />
                  </SelectTrigger>
                  <SelectContent>
                    {INSTRUMENTS.map((inst) => (
                      <SelectItem key={inst.value} value={inst.value}>
                        {inst.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Octave</label>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setOctave((o) => Math.max(0, o - 1))}
                    disabled={octave === 0}
                    variant="outline"
                  >
                    -
                  </Button>
                  <span className="font-mono text-lg w-12 text-center">{octave}</span>
                  <Button
                    onClick={() => setOctave((o) => Math.min(8, o + 1))}
                    disabled={octave === 8}
                    variant="outline"
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Demo Melody</label>
                <CardDescription>"Es ist vollbracht"</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Button onClick={playDemo} disabled={isPlayingDemo} variant="outline" size="icon">
                    {isPlayingDemo ? <Pause /> : <Play />}
                    <span className="sr-only">Play/Pause</span>
                  </Button>
                  <Button onClick={stopDemo} variant="outline" size="icon">
                    <Rewind />
                    <span className="sr-only">Rewind</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent"/> AI Harmony Helper</CardTitle>
              <CardDescription>Get AI-powered chord & harmony suggestions.</CardDescription>
            </CardHeader>
            <CardContent>
              <HarmonySuggester />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
