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
  const getFullNote = (note: string, octave: number) => `${note}${octave}`;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.repeat) return;
      const key = event.key.toLowerCase();
      const noteName = KEYBOARD_MAPPING[key];
      if (noteName) {
        const currentOctave = ['k', 'o', 'l', 'p', ';'].includes(key) ? octave + 1 : octave;
        const fullNote = getFullNote(noteName, currentOctave);
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
        const currentOctave = ['k', 'o', 'l', 'p', ';'].includes(key) ? octave + 1 : octave;
        const fullNote = getFullNote(noteName, currentOctave);
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

  const keysToRender = React.useMemo(() => {
    const keys = [];
    for (let o = octave; o < octave + 2; o++) {
      for (const note of NOTES) {
        keys.push({ note, octave: o });
      }
    }
    const startIndex = keys.findIndex(k => k.note === 'C' && k.octave === octave);
    return keys.slice(startIndex, startIndex + 25);
  }, [octave]);


  const whiteKeys = keysToRender.filter(k => !k.note.includes('#'));

  const handleInteractionStart = (fullNote: string) => {
    playNote(fullNote);
    setActiveNotes((prev) => [...prev, fullNote]);
  };

  const handleInteractionEnd = (fullNote: string) => {
    stopNote(fullNote);
    setActiveNotes((prev) => prev.filter((n) => n !== fullNote));
  };
  
  return (
    <div className="relative flex h-48 w-full touch-none select-none">
      {whiteKeys.map(({ note, octave: keyOctave }, i) => {
        const fullNote = getFullNote(note, keyOctave);
        const isActive = activeNotes.includes(fullNote);
        return (
          <div
            key={fullNote}
            onMouseDown={() => handleInteractionStart(fullNote)}
            onMouseUp={() => handleInteractionEnd(fullNote)}
            onMouseLeave={() => isActive && handleInteractionEnd(fullNote)}
            onTouchStart={(e) => { e.preventDefault(); handleInteractionStart(fullNote); }}
            onTouchEnd={() => handleInteractionEnd(fullNote)}
            className={cn(
              'flex h-full w-full flex-col justify-end rounded-b-md border-2 border-b-8 border-t-0 border-neutral-300 bg-key-white p-2 text-neutral-900 transition-colors hover:bg-neutral-200',
              isActive && 'border-b-primary bg-primary/20'
            )}
          >
            <span className="pointer-events-none text-xs font-semibold">{note}</span>
          </div>
        );
      })}

      {keysToRender.map(({ note, octave: keyOctave }, i) => {
        if (!note.includes('#')) return null;

        const fullNote = getFullNote(note, keyOctave);
        const isActive = activeNotes.includes(fullNote);
        const whiteKeyIndex = whiteKeys.findIndex(
          (wk) => wk.octave > keyOctave || (wk.octave === keyOctave && NOTES.indexOf(wk.note) > NOTES.indexOf(note))
        );
        const left = (whiteKeyIndex / whiteKeys.length) * 100;

        return (
          <div
            key={fullNote}
            style={{
              left: `${left}%`,
              width: `calc(${100 / whiteKeys.length}% * 0.6)`,
            }}
            onMouseDown={() => handleInteractionStart(fullNote)}
            onMouseUp={() => handleInteractionEnd(fullNote)}
            onMouseLeave={() => isActive && handleInteractionEnd(fullNote)}
            onTouchStart={(e) => { e.preventDefault(); handleInteractionStart(fullNote); }}
            onTouchEnd={() => handleInteractionEnd(fullNote)}
            className={cn(
              'absolute top-0 z-10 h-[60%] -ml-[calc(100%/var(--total-white-keys)*0.3)] cursor-pointer select-none rounded-b-md border-b-4 border-neutral-800 bg-neutral-900 transition-colors hover:bg-neutral-700',
              isActive && 'bg-primary border-b-primary-foreground/50'
            )}
            style={{
                '--total-white-keys': whiteKeys.length,
                left: `${(whiteKeyIndex / whiteKeys.length) * 100}%`,
                width: `calc(100% / var(--total-white-keys) * 0.6)`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
