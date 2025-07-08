'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';

export type InstrumentName = 'piano' | 'organ' | 'strings';

const createSynth = (instrument: InstrumentName) => {
  switch (instrument) {
    case 'organ':
      return new Tone.PolySynth(Tone.AMSynth, {
        harmonicity: 1.5,
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 },
        modulation: { type: 'sine' },
        modulationEnvelope: { attack: 0.1, decay: 0, sustain: 1, release: 0.2 },
      }).toDestination();
    case 'strings':
      return new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 3,
        modulationIndex: 10,
        detune: 0,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.2, decay: 0.1, sustain: 1, release: 0.5 },
        modulation: { type: 'triangle' },
        modulationEnvelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.5 },
      }).toDestination();
    case 'piano':
    default:
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'fmtriangle', harmonicity: 0.5, modulationType: 'sine' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 1 },
      }).toDestination();
  }
};

export function useSound() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const instrumentRef = useRef<Tone.PolySynth | null>(null);
  
  const initializeAudio = useCallback(async () => {
    await Tone.start();
    console.log('Audio context started');
    instrumentRef.current = createSynth('piano');
    setIsLoaded(true);
  }, []);

  const setInstrument = useCallback((instrumentName: InstrumentName) => {
    instrumentRef.current?.dispose();
    instrumentRef.current = createSynth(instrumentName);
  }, []);

  const playNote = useCallback((note: string) => {
    if (isLoaded && instrumentRef.current) {
      instrumentRef.current.triggerAttack(note, Tone.now());
    }
  }, [isLoaded]);

  const stopNote = useCallback((note: string) => {
    if (isLoaded && instrumentRef.current) {
      instrumentRef.current.triggerRelease(note, Tone.now());
    }
  }, [isLoaded]);

  const playChord = useCallback((notes: string[], duration: Tone.Unit.Time) => {
    if (isLoaded && instrumentRef.current) {
      instrumentRef.current.triggerAttackRelease(notes, duration, Tone.now());
    }
  }, [isLoaded]);

  const playNoteWithDuration = useCallback((note: string, duration: Tone.Unit.Time) => {
    if (isLoaded && instrumentRef.current) {
      instrumentRef.current.triggerAttackRelease(note, duration, Tone.now());
    }
  }, [isLoaded]);

  const toggleMute = useCallback(() => {
    Tone.Destination.mute = !Tone.Destination.mute;
    setIsMuted(Tone.Destination.mute);
  }, []);

  return {
    isLoaded,
    isMuted,
    playNote,
    stopNote,
    playChord,
    playNoteWithDuration,
    setInstrument,
    toggleMute,
    initializeAudio,
  };
}
