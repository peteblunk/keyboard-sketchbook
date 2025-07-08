'use client';

import * as React from 'react';
import {
  Keyboard,
  Music,
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
import { TYPICAL_PROGRESSIONS, COMMON_OTHER_CHORDS } from '@/lib/constants';
import { Logo } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { SuggestHarmonyOutput, Chord } from '@/ai/flows/suggest-harmony';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const ALL_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Builds a Dominant 7th chord from a root note.
 */
function getDominant7thChord(rootNote: string): Chord {
  const rootIndex = ALL_NOTES.indexOf(rootNote);
  if (rootIndex === -1) {
    return { name: 'Error', notes: [] };
  }
  const third = ALL_NOTES[(rootIndex + 4) % 12];
  const fifth = ALL_NOTES[(rootIndex + 7) % 12];
  const seventh = ALL_NOTES[(rootIndex + 10) % 12];
  return {
    name: `${rootNote}7`,
    notes: [rootNote, third, fifth, seventh],
  };
}
export default function Home() {
  const [octave, setOctave] = React.useState(4);
  const [activeNotes, setActiveNotes] = React.useState<string[]>([]);
  const [pianoKey, setPianoKey] = React.useState<string>('C Major');
  const [aiChordProgression, setAiChordProgression] = React.useState<Chord[] | null>(null);
  const [sketchbookRows, setSketchbookRows] = React.useState<SketchbookRow[]>([{ id: 0, entries: [] }]);
  const entryIdCounter = React.useRef(0);
  const rowIdCounter = React.useRef(1);
  const [sketchbookEnabled, setSketchbookEnabled] = React.useState(true);

  const {
    isLoaded,
    isMuted,
    playNote,
    stopNote,
    playChord,
    playNoteWithDuration,
    setInstrument,
    toggleMute,
    initializeAudio,
  } = useSound();
  const [audioInitialized, setAudioInitialized] = React.useState(false);
  const notesInKey = pianoKey ? KEY_NOTES[pianoKey] : null;
  const [selectedProgressionName, setSelectedProgressionName] = React.useState<string | null>(null);


  const getNoteFromDegree = React.useCallback((degree: number, keyNotes: string[]): string | undefined => {
      return keyNotes[degree - 1];
  }, []);

  const getMajorTriad = React.useCallback((root: string, keyNotes: string[]): string[] | undefined => {
    const rootIndexInKey = keyNotes.indexOf(root);
    if (rootIndexInKey === -1) return undefined;

    const third = keyNotes[(rootIndexInKey + 2) % keyNotes.length];
    const fifth = keyNotes[(rootIndexInKey + 4) % keyNotes.length];

    return [root, third, fifth];
  }, []);

  const getMinorTriad = React.useCallback((root: string, keyNotes: string[]): string[] | undefined => {
    const rootIndexInKey = keyNotes.indexOf(root);
    if (rootIndexInKey === -1) return undefined;

    const third = NOTES[(NOTES.indexOf(root) + 3) % NOTES.length]; 
    const fifth = NOTES[(NOTES.indexOf(root) + 7) % NOTES.length]; 

      if (NOTES.includes(root) && NOTES.includes(third) && NOTES.includes(fifth)) {
        return [root, third, fifth];
      }
      return undefined;

  }, []);

    const getDiminishedTriad = React.useCallback((root: string): string[] | undefined => {
        const rootIndex = NOTES.indexOf(root);
        if (rootIndex === -1) return undefined;
        const third = NOTES[(rootIndex + 3) % NOTES.length];
        const fifth = NOTES[(rootIndex + 6) % NOTES.length];
        if (NOTES.includes(root) && NOTES.includes(third) && NOTES.includes(fifth)) {
              return [root, third, fifth];
        }
        return undefined;
    }, []);

const calculateDefaultChordProgressions = React.useCallback((key: string) => {
  const progressions: { name: string; chords: Chord[] }[] = [];
  const otherChords: Chord[] = [];
  const notes = KEY_NOTES[key];
  if (!notes) return { progressions: [], otherChords: [] };

  const ROMAN_TO_DEGREE: { [key: string]: number } = { 'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5, 'vi': 6, 'vii': 7 };

  const getChordFromRoman = (roman: string): Chord | undefined => {
    if (roman.includes('/')) {
      const parts = roman.split('/');
      const targetRoman = parts[1].toLowerCase();
      const targetDegree = ROMAN_TO_DEGREE[targetRoman];
      if (!targetDegree) return undefined;

      const targetRoot = notes[targetDegree - 1];
      const targetRootIndex = ALL_NOTES.indexOf(targetRoot);
      const dominantRootNote = ALL_NOTES[(targetRootIndex + 7) % 12];
      
      return getDominant7thChord(dominantRootNote);
    }

    const degreeMatch = roman.match(/^([iIvV]+)/);
    if (!degreeMatch) return undefined;
    
    const degreeRoman = degreeMatch[1];
    const degree = ROMAN_TO_DEGREE[degreeRoman.toLowerCase()];
    if (!degree) return undefined;

    const rootNote = notes[degree - 1];
    if (!rootNote) return undefined;

    let chordNotes: string[] = [];
    let chordName = rootNote;
    const rootIndex = NOTES.indexOf(rootNote);

    if (degreeRoman === 'I' || degreeRoman === 'IV' || degreeRoman === 'V') {
      chordNotes = [rootNote, NOTES[(rootIndex + 4) % NOTES.length], NOTES[(rootIndex + 7) % NOTES.length]];
    } else if (degreeRoman === 'ii' || degreeRoman === 'iii' || degreeRoman === 'vi') {
      chordNotes = [rootNote, NOTES[(rootIndex + 3) % NOTES.length], NOTES[(rootIndex + 7) % NOTES.length]];
      chordName += 'm';
    } else if (degreeRoman.toLowerCase() === 'vii') {
      chordNotes = [rootNote, NOTES[(rootIndex + 3) % NOTES.length], NOTES[(rootIndex + 6) % NOTES.length]];
      chordName += '°';
    }

    if (chordNotes.length > 0) {
      return { name: chordName, notes: chordNotes };
    }
    return undefined;
  };

  for (const progDef of TYPICAL_PROGRESSIONS) {
    const chords: Chord[] = [];
    for (const roman of progDef.romanNumerals) {
      const chord = getChordFromRoman(roman);
      if (chord) {
        chords.push(chord);
      }
    }
    if (chords.length > 0) {
      progressions.push({ name: progDef.name, chords });
    }
  }

  for (const roman of COMMON_OTHER_CHORDS) {
    const chord = getChordFromRoman(roman);
      if (chord) {
        otherChords.push(chord);
      }
  }

  return { progressions, otherChords };
}, []);

  const handleInitializeAudio = React.useCallback(async () => {
    await initializeAudio();
    setAudioInitialized(true);
  }, [initializeAudio]);

  const addTranscriptEntry = React.useCallback((content: string, type: 'note' | 'chord') => {
    if (!sketchbookEnabled) return;
    setSketchbookRows(prevRows => {
      const newEntry: TranscriptEntry = { id: entryIdCounter.current++, content, type };
      const newRows = [...prevRows];
      const lastRowIndex = newRows.length - 1;
      newRows[lastRowIndex] = {
        ...newRows[lastRowIndex],
        entries: [...newRows[lastRowIndex].entries, newEntry]
      };
      return newRows;
    });
  }, [sketchbookEnabled]);
  
  const handleAddRow = React.useCallback(() => {
    setSketchbookRows(prev => [...prev, { id: rowIdCounter.current++, entries: [] }]);
  }, []);
  

  const handleClearEntry = React.useCallback((rowId: number, entryId: number) => {
    setSketchbookRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId
          ? { ...row, entries: row.entries.filter(entry => entry.id !== entryId) }
          : row
      )
    );
  }, []);
  
  const handleClearAllEntries = React.useCallback(() => {
    setSketchbookRows([{ id: 0, entries: [] }]);
    rowIdCounter.current = 1;
    entryIdCounter.current = 0;
  }, []);

  const handleChordPlay = React.useCallback((chord: Chord, addToTranscript = true) => {
    if (!chord.notes || chord.notes.length === 0) return;
  
    if (addToTranscript) {
      addTranscriptEntry(chord.name, 'chord');
    }

    const rootNote = chord.notes[0];
    const rootIndex = NOTES.indexOf(rootNote);
  
    const notesToPlay = chord.notes.map(note => {
      const noteIndex = NOTES.indexOf(note);
      const currentOctave = noteIndex < rootIndex ? octave + 1 : octave;
      return `${note}${currentOctave}`;
    });
  
    playChord(notesToPlay, '1s');
  
    setActiveNotes(prev => [...prev, ...notesToPlay]);
  
    setTimeout(() => {
      setActiveNotes(prev => prev.filter(n => !notesToPlay.includes(n)));
    }, 1000);

  }, [addTranscriptEntry, octave, playChord]);

  const handlePlayEntry = React.useCallback((entry: TranscriptEntry) => {
    if (entry.type === 'note') {
      playNoteWithDuration(entry.content, '8n');
      setActiveNotes(prev => [...prev, entry.content]);
      setTimeout(() => {
        setActiveNotes(prev => prev.filter(n => n !== entry.content));
      }, 500);
    } 
      else if (entry.type === 'chord') {
      let matchedChord = aiChordProgression?.find(c => c.name === entry.content);
      if (!matchedChord) {
          const defaultProgs = calculateDefaultChordProgressions(pianoKey);
          matchedChord = defaultProgs.otherChords.find(c => c.name === entry.content);
          if (!matchedChord) {
              for (const prog of defaultProgs.progressions) {
                  matchedChord = prog.chords.find(c => c.name === entry.content);
                  if (matchedChord) break;
              }
          }
        }
      if (matchedChord) {
        handleChordPlay(matchedChord, false);
      }
    }

  }, [aiChordProgression, calculateDefaultChordProgressions, pianoKey, handleChordPlay, playNoteWithDuration]);

  const defaultChordProgressions = React.useMemo(() => {
      return calculateDefaultChordProgressions(pianoKey);
  }, [pianoKey, calculateDefaultChordProgressions]);

  React.useEffect(() => {
    if (defaultChordProgressions.progressions.length > 0) {
        setSelectedProgressionName(defaultChordProgressions.progressions[0].name);
    } else {
        setSelectedProgressionName(null);
    }
  }, [defaultChordProgressions.progressions]);

  const displayedChordProgressions = aiChordProgression
    ? { progressions: [{ name: 'AI Suggestion', chords: aiChordProgression }], otherChords: [] }
    : defaultChordProgressions;


  if (!audioInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <Logo className="w-24 h-24 text-primary mb-6" />
        <h1 className="text-4xl font-headline mb-2">Welcome to Keyboard Sketchbook</h1>
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
              <h1 className="text-2xl font-bold font-headline">Keyboard Sketchbook</h1>
              <p className="text-sm text-muted-foreground">A tool for musical exploration</p>
            </div>
          </div>
          <Button onClick={toggleMute} variant="ghost" size="icon">
            {isMuted ? <VolumeX /> : <Volume2 />}
            <span className="sr-only">Toggle Mute</span>
          </Button>
        </header>

        <div className="xl:col-span-12 flex flex-col gap-6">
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
                <label className="text-sm font-medium mb-2 block">Selected Key</label>
                <Select onValueChange={setPianoKey} value={pianoKey}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a key" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(KEY_NOTES).map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="sketchbook-toggle">Record to Sketchbook</Label>
                <Switch
                  id="sketchbook-toggle"
                  checked={sketchbookEnabled}
                  onCheckedChange={setSketchbookEnabled}
                />
              </div>
            </CardContent>
          </Card>
          
          {pianoKey && notesInKey && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active Key: {pianoKey}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The following notes are in this key:{" "}
                  <span className="font-mono text-foreground tracking-wider">{notesInKey.join(', ')}</span>
                </p>
              </CardContent>
            </Card>
          )}
          
          {displayedChordProgressions && displayedChordProgressions.progressions.length > 0 && !aiChordProgression && (
              <div>
                  <label className="text-sm font-medium mb-2 block">Select Chord Progression</label>
                  <Select onValueChange={setSelectedProgressionName} value={selectedProgressionName || ''}>
                      <SelectTrigger>
                          <SelectValue placeholder="Select a progression" />
                      </SelectTrigger>
                      <SelectContent>
                          {displayedChordProgressions.progressions.map((prog) => (
                              <SelectItem key={prog.name} value={prog.name}>
                                  {prog.name}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Chord Progression Player</CardTitle>
              <CardDescription>Click a chord to hear it played.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiChordProgression ? (
                <div className="w-full">
                  <h4 className="text-sm font-semibold mb-2">AI Suggestion</h4>
                  <div className="flex flex-wrap gap-2">
                    {aiChordProgression.map((chord, index) => (
                      <Button
                        key={`ai-chord-${index}`}
                        variant="outline"
                        onClick={() => handleChordPlay(chord)}
                      >
                        {chord.name}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}

              {selectedProgressionName && !aiChordProgression ? (
                displayedChordProgressions.progressions
                  .filter(prog => prog.name === selectedProgressionName)
                  .map(prog => (
                    <div key={prog.name} className="w-full">
                      <h4 className="text-sm font-semibold mb-2">{prog.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {prog.chords.map((chord, index) => (
                          <Button
                            key={`${prog.name}-${chord.name}-${index}`}
                            variant="outline"
                            onClick={() => handleChordPlay(chord)}
                          >
                            {chord.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))
              ) : null}

              {displayedChordProgressions.otherChords.length > 0 && (
                <div className="w-full">
                  <h4 className="text-sm font-semibold mb-2">Other Common Chords</h4>
                  <div className="flex flex-wrap gap-2">
                    {displayedChordProgressions.otherChords.map((chord, index) => (
                      <Button
                        key={`other-chord-${index}`}
                        variant="outline"
                        onClick={() => handleChordPlay(chord)}
                      >
                        {chord.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl overflow-hidden shadow-lg border-2 border-border">
            <CardContent className="p-4 md:p-6">
              <Piano
                octave={octave}
                playNote={playNote}
                stopNote={stopNote}
                activeNotes={activeNotes}
                setActiveNotes={setActiveNotes}
                notesInKey={notesInKey}
                onNotePlay={addTranscriptEntry}
              />
            </CardContent>
          </Card>
          
          {sketchbookEnabled && (
            <Sketchbook 
              rows={sketchbookRows}
              onClearEntry={handleClearEntry}
              onClearAll={handleClearAllEntries}
              onAddRow={handleAddRow}
              onPlayEntry={handlePlayEntry}
            />
          )}

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
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent"/> AI Harmony Helper</CardTitle>
              <CardDescription>Get AI-powered chord & harmony suggestions.</CardDescription>
            </CardHeader>
            <CardContent>
              <HarmonySuggester onChordProgressionChange={setAiChordProgression} selectedKey={pianoKey} onKeyChange={setPianoKey} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
