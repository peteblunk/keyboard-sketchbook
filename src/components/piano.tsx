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
  notesInKey: string[] | null;
  onNotePlay?: (note: string, type: 'note') => void;
}

export function Piano({ octave, playNote, stopNote, activeNotes, setActiveNotes, notesInKey, onNotePlay }: PianoProps) {
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
        onNotePlay?.(fullNote, 'note');
        setActiveNotes((prev) => [...prev, fullNote]);
      }
    },
    [octave, playNote, setActiveNotes, onNotePlay]
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
    onNotePlay?.(fullNote, 'note');
    setActiveNotes((prev) => [...prev, fullNote]);
  };

  const handleInteractionEnd = (fullNote: string) => {
    stopNote(fullNote);
    setActiveNotes((prev) => prev.filter((n) => n !== fullNote));
  };

  const getBlackKeyLabel = (note: string) => {
    if (!notesInKey) return note; // Default to sharp if no key is selected
  
    const sharpName = note;
    const flatName = NOTES[NOTES.indexOf(note) - 1]?.replace('#', 'b');
  
    // Check if the sharp name is in the key
    const isSharpInKey = notesInKey.includes(sharpName);
  
    // Check if the flat name exists and is in the key
    const isFlatInKey = flatName && notesInKey.includes(flatName);
  
    if (isSharpInKey) {
      return sharpName; // Return sharp name if it's in the key
    } else if (isFlatInKey) {
      return flatName; // Return flat name if it's in the key and sharp is not
    } else {
      return sharpName; // Fallback to sharp name if neither is in the key
    }
  };
  
  return (
    <div className="relative flex h-48 w-full touch-none select-none">
      {whiteKeys.map(({ note, octave: keyOctave }, i) => {
        const fullNote = getFullNote(note, keyOctave);
        const isActive = activeNotes.includes(fullNote);
        const isInKey = !notesInKey || notesInKey.includes(note);

        return (
          <div
            key={fullNote}
            onMouseDown={() => handleInteractionStart(fullNote)}
            onMouseUp={() => handleInteractionEnd(fullNote)}
            onMouseLeave={() => isActive && handleInteractionEnd(fullNote)}
            onTouchStart={(e) => { e.preventDefault(); handleInteractionStart(fullNote); }}
            onTouchEnd={() => handleInteractionEnd(fullNote)}
            className={cn(
              'relative flex h-full w-full flex-col justify-end rounded-b-md border-2 border-b-8 border-t-0 border-neutral-300 bg-key-white p-2 text-neutral-900 transition-all hover:bg-neutral-200',
              isActive && 'border-b-primary bg-primary/20',
              !isInKey && 'bg-neutral-300 opacity-60'
            )}
          >
            <span className="pointer-events-none absolute bottom-6 left-1/2 transform -translate-x-1/2 text-lg font-semibold">{note}</span>
          </div>
        );
      })}

      {keysToRender.map(({ note, octave: keyOctave }, i) => {
        if (!note.includes('#')) return null;

        const fullNote = getFullNote(note, keyOctave);
        const isActive = activeNotes.includes(fullNote);
        const isInKey = !notesInKey || notesInKey.includes(note);
        const whiteKeyIndex = whiteKeys.findIndex(
          (wk) => wk.octave > keyOctave || (wk.octave === keyOctave && NOTES.indexOf(wk.note) > NOTES.indexOf(note))
        );
        
        return (
          <div key={fullNote}

            onMouseDown={(e) => { e.stopPropagation(); handleInteractionStart(fullNote); }}
            onMouseUp={(e) => { e.stopPropagation(); handleInteractionEnd(fullNote); }}
            onMouseLeave={(e) => { e.stopPropagation(); isActive && handleInteractionEnd(fullNote); }}
            onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); handleInteractionStart(fullNote); }}
            onTouchEnd={(e) => { e.stopPropagation(); handleInteractionEnd(fullNote); }}
            className={cn(
              'absolute top-0 z-10 h-[60%] w-[calc(100%/var(--total-white-keys)*0.6)] -ml-[calc(100%/var(--total-white-keys)*0.3)] cursor-pointer select-none rounded-b-md border-b-4 border-neutral-800 bg-neutral-900 transition-colors hover:bg-neutral-700',
              isActive && 'bg-neutral-600 border-b-neutral-500',
              isInKey && 'border-accent bg-neutral-800', // Keep base black color when in key
              !isInKey && 'bg-neutral-600 opacity-60'
            )}
            style={{
                '--total-white-keys': whiteKeys.length,
 left: `${(whiteKeyIndex / whiteKeys.length) * 100}%`,
            } as React.CSSProperties}>
 <span className="pointer-events-none absolute bottom-6 left-1/2 transform -translate-x-1/2 text-base font-semibold text-white">{getBlackKeyLabel(note)}</span>          </div>
        );
      })}
    </div>
  );
}
