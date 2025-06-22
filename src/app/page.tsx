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
import { Sketchbook, type TranscriptEntry, type SketchbookRow } from '@/components/sketchbook';
import { KEYBOARD_MAPPING, INSTRUMENTS, KEY_NOTES, NOTES } from '@/lib/constants';
import { Logo } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { SuggestHarmonyOutput, Chord } from '@/ai/flows/suggest-harmony';

export default function Home() {
  const [octave, setOctave] = React.useState(4);
  const [activeNotes, setActiveNotes] = React.useState<string[]>([]);
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);
  const [chordProgression, setChordProgression] = React.useState<Chord[] | null>(null);

  const [sketchbookRows, setSketchbookRows] = React.useState<SketchbookRow[]>([{ id: 0, entries: [] }]);
  const entryIdCounter = React.useRef(0);
  const rowIdCounter = React.useRef(1);

  const {
    isLoaded,
    isPlayingDemo,
    isMuted,
    playNote,
    stopNote,
    playChord,
    playNoteWithDuration,
    setInstrument,
    playDemo,
    stopDemo,
    toggleMute,
    initializeAudio,
  } = useSound();
  const [audioInitialized, setAudioInitialized] = React.useState(false);

  const notesInKey = selectedKey ? KEY_NOTES[selectedKey] : null;

  const handleInitializeAudio = async () => {
    await initializeAudio();
    setAudioInitialized(true);
  };

  const addTranscriptEntry = (content: string, type: 'note' | 'chord') => {
    const newEntry: TranscriptEntry = { id: entryIdCounter.current++, content, type };
    setSketchbookRows(prevRows => {
      const newRows = [...prevRows];
      const lastRow = newRows[newRows.length - 1];
      if (lastRow) {
        lastRow.entries.push(newEntry);
      }
      return newRows;
    });
  };

  const handleAddRow = () => {
    setSketchbookRows(prev => [...prev, { id: rowIdCounter.current++, entries: [] }]);
  };

  const handleClearEntry = (rowId: number, entryId: number) => {
    setSketchbookRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId
          ? { ...row, entries: row.entries.filter(entry => entry.id !== entryId) }
          : row
      )
    );
  };

  const handleClearAllEntries = () => {
    setSketchbookRows([{ id: 0, entries: [] }]);
    rowIdCounter.current = 1;
    entryIdCounter.current = 0;
  };

  const handlePlayEntry = (entry: TranscriptEntry) => {
    if (entry.type === 'note') {
      playNoteWithDuration(entry.content, '8n');
      setActiveNotes(prev => [...prev, entry.content]);
      setTimeout(() => {
        setActiveNotes(prev => prev.filter(n => n !== entry.content));
      }, 500);
    } else if (entry.type === 'chord') {
      const chord = chordProgression?.find(c => c.name === entry.content);
      if (chord) {
        handleChordPlay(chord, false); // Don't add to transcript again
      }
    }
  };

  const handleChordPlay = (chord: Chord, addToTranscript = true) => {
    if (!chord.notes || chord.notes.length === 0) return;
  
    if (addToTranscript) {
      addTranscriptEntry(chord.name, 'chord');
    }

    const rootNote = chord.notes[0];
    const rootIndex = NOTES.indexOf(rootNote);
  
    const notesToPlay = chord.notes.map(note => {
      const noteIndex = NOTES.indexOf(note);
      // If note comes before root note in the scale array, it's in the next octave up
      const currentOctave = noteIndex < rootIndex ? octave + 1 : octave;
      return `${note}${currentOctave}`;
    });
  
    playChord(notesToPlay, '1s');
  
    // Highlight notes on the piano
    setActiveNotes(prev => [...prev, ...notesToPlay]);
  
    // Un-highlight notes after they finished playing
    setTimeout(() => {
      setActiveNotes(prev => prev.filter(n => !notesToPlay.includes(n)));
    }, 1000);
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
          {selectedKey && notesInKey && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active Key: {selectedKey}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The following notes are in this key:{" "}
                  <span className="font-mono text-foreground tracking-wider">{notesInKey.join(', ')}</span>
                </p>
              </CardContent>
            </Card>
          )}

          {chordProgression && chordProgression.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Chord Progression Player</CardTitle>
                <CardDescription>Click a chord to hear it played.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {chordProgression.map((chord, index) => (
                  <Button
                    key={`${chord.name}-${index}`}
                    variant="outline"
                    onClick={() => handleChordPlay(chord)}
                  >
                    {chord.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          <Sketchbook 
            rows={sketchbookRows}
            onClearEntry={handleClearEntry}
            onClearAll={handleClearAllEntries}
            onAddRow={handleAddRow}
            onPlayEntry={handlePlayEntry}
          />

          <Card className="rounded-xl overflow-hidden shadow-lg border-2 border-border">
            <CardContent className="p-4 md:p-6">
              <Piano
                octave={octave}
                playNote={playNote}
                stopNote={stopNote}
                activeNotes={activeNotes}
                setActiveNotes={setActiveNotes}
                notesInKey={notesInKey}
                onNotePlay={(note) => addTranscriptEntry(note, 'note')}
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
              <HarmonySuggester onKeyChange={setSelectedKey} onChordProgressionChange={setChordProgression} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
