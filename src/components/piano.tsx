'use client';

import React, { useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { NOTES, KEYBOARD_MAPPING } from '@/lib/constants';

interface PianoProps {
  octave: number;
  playNote: (note: string) => void;
  stopNote: (note: string) => void;
  activeNotes: string[];
  setActiveNotes: React.Dispatch<React.SetStateAction<string[]>>;
}

export function Piano({ octave, playNote, stopNote, activeNotes, setActiveNotes }: PianoProps) {
  const getNote = (note: string, currentOctave: number) => {
    const noteIndex = NOTES.indexOf(note.toUpperCase());
    if (noteIndex > NOTES.indexOf('B')) {
      return `${note}${currentOctave + 1}`;
    }
    return `${note}${currentOctave}`;
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.repeat) return;
      const key = event.key.toLowerCase();
      const noteName = KEYBOARD_MAPPING[key];
      if (noteName) {
        const currentOctave = key === 'k' || key === 'o' || key === 'l' || key === 'p' || key === ';'? octave + 1 : octave;
        const fullNote = getNote(noteName, currentOctave);
        playNote(fullNote);
        setActiveNotes((prev) => [...prev, fullNote]);
      }
    },
    [octave, playNote, setActiveNotes]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const noteName = KEYBOARD_MAPPING[key];
      if (noteName) {
        const currentOctave = key === 'k' || key === 'o' || key === 'l' || key === 'p' || key === ';'? octave + 1 : octave;
        const fullNote = getNote(noteName, currentOctave);
        stopNote(fullNote);
        setActiveNotes((prev) => prev.filter((n) => n !== fullNote));
      }
    },
    [octave, stopNote, setActiveNotes]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const keys = [
    ...NOTES.map((note) => ({ note, octave })),
    ...NOTES.map((note) => ({ note, octave: octave + 1 })),
  ].slice(0, 25); // ~2 octaves

  const Key = ({ note, isBlack, fullNote }: { note: string, isBlack: boolean, fullNote: string }) => {
    const isActive = activeNotes.includes(fullNote);
    return (
      <div
        onMouseDown={() => {
          playNote(fullNote);
          setActiveNotes((prev) => [...prev, fullNote]);
        }}
        onMouseUp={() => {
          stopNote(fullNote);
          setActiveNotes((prev) => prev.filter((n) => n !== fullNote));
        }}
        onMouseLeave={() => {
          if (isActive) {
            stopNote(fullNote);
            setActiveNotes((prev) => prev.filter((n) => n !== fullNote));
          }
        }}
        className={cn(
          'relative flex h-full cursor-pointer select-none items-end justify-center rounded-b-md border-b-4 border-r border-l transition-colors',
          isBlack
            ? 'z-10 h-2/3 w-[55%] -ml-[27.5%] -mr-[27.5%] border-x-4 border-card bg-gray-800 text-white hover:bg-gray-700'
            : 'w-full bg-card text-card-foreground hover:bg-muted',
          isActive && !isBlack && 'bg-primary/70 border-primary',
          isActive && isBlack && 'bg-primary border-primary-foreground/50',
          isBlack ? 'border-transparent' : 'border-border'
        )}
      >
        <span className="text-xs font-semibold">{note.endsWith('#') ? '' : note}</span>
      </div>
    );
  };
  
  return (
    <div className="relative flex h-48 w-full touch-none">
      {keys.map(({ note, octave: keyOctave }, index) => {
        const fullNote = getNote(note, keyOctave);
        const isBlack = note.includes('#');
        return <Key key={index} note={note} isBlack={isBlack} fullNote={fullNote} />;
      })}
    </div>
  );
}
