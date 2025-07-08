export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const KEYBOARD_MAPPING: { [key: string]: string } = {
  'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E', 'f': 'F',
  't': 'F#', 'g': 'G', 'y': 'G#', 'h': 'A', 'u': 'A#', 'j': 'B',
  'k': 'C', 'o': 'C#', 'l': 'D', 'p': 'D#', ';': 'E',
};

export const INSTRUMENTS: { value: 'piano' | 'organ' | 'strings'; label: string }[] = [
  { value: 'piano', label: 'Piano' },
  { value: 'organ', label: 'Organ' },
  { value: 'strings', label: 'Strings' },
];

export const MUSICAL_KEYS = [
  "C Major", "G Major", "D Major", "A Major", "E Major", "B Major", "F# Major", "C# Major",
  "A Minor", "E Minor", "B Minor", "F# Minor", "C# Minor", "G# Minor", "D# Minor", "A# Minor",
  "F Major", "Bb Major", "Eb Major", "Ab Major", "Db Major", "Gb Major", "Cb Major",
  "D Minor", "G Minor", "C Minor", "F Minor", "Bb Minor", "Eb Minor", "Ab Minor",
];

export const KEY_NOTES: { [key: string]: string[] } = {
  // Major Keys
  "C Major": ["C", "D", "E", "F", "G", "A", "B"],
  "G Major": ["G", "A", "B", "C", "D", "E", "F#"],
  "D Major": ["D", "E", "F#", "G", "A", "B", "C#"],
  "A Major": ["A", "B", "C#", "D", "E", "F#", "G#"],
  "E Major": ["E", "F#", "G#", "A", "B", "C#", "D#"],
  "B Major": ["B", "C#", "D#", "E", "F#", "G#", "A#"],
  "F# Major": ["F#", "G#", "A#", "B", "C#", "D#", "F"], // E# is F
  "C# Major": ["C#", "D#", "F", "F#", "G#", "A#", "C"], // E# is F, B# is C
  "F Major": ["F", "G", "A", "A#", "C", "D", "E"], // Bb is A#
  "Bb Major": ["A#", "C", "D", "D#", "F", "G", "A"], // Bb is A#, Eb is D#
  "Eb Major": ["D#", "F", "G", "G#", "A#", "C", "D"], // Eb is D#, Ab is G#, Bb is A#
  "Ab Major": ["G#", "A#", "C", "C#", "D#", "F", "G"], // Ab is G#, Bb is A#, Db is C#, Eb is D#
  "Db Major": ["C#", "D#", "F", "F#", "G#", "A#", "C"], // Db is C#, Eb is D#, Gb is F#, Ab is G#, Bb is A#
  "Gb Major": ["F#", "G#", "A#", "B", "C#", "D#", "F"], // Gb is F#, Ab is G#, Bb is A#, Cb is B, Db is C#, Eb is D#
  "Cb Major": ["B", "C#", "D#", "E", "F#", "G#", "A#"], // Cb is B, Db is C#, Eb is D#, Fb is E, Gb is F#, Ab is G#, Bb is A#
  // Minor Keys (Natural Minor)
  "A Minor": ["A", "B", "C", "D", "E", "F", "G"],
  "E Minor": ["E", "F#", "G", "A", "B", "C", "D"],
  "B Minor": ["B", "C#", "D", "E", "F#", "G", "A"],
  "F# Minor": ["F#", "G#", "A", "B", "C#", "D", "E"],
  "C# Minor": ["C#", "D#", "E", "F#", "G#", "A", "B"],
  "G# Minor": ["G#", "A#", "B", "C#", "D#", "E", "F#"],
  "D# Minor": ["D#", "F", "F#", "G#", "A#", "B", "C#"], // E# is F
  "A# Minor": ["A#", "C", "C#", "D#", "F", "F#", "G#"], // B# is C, E# is F
  "D Minor": ["D", "E", "F", "G", "A", "A#", "C"], // Bb is A#
  "G Minor": ["G", "A", "A#", "C", "D", "D#", "F"], // Bb is A#, Eb is D#
  "C Minor": ["C", "D", "D#", "F", "G", "G#", "A#"], // Eb is D#, Ab is G#, Bb is A#
  "F Minor": ["F", "G", "G#", "A#", "C", "C#", "D#"], // Ab is G#, Bb is A#, Db is C#, Eb is D#
  "Bb Minor": ["A#", "C", "C#", "D#", "F", "F#", "G#"], // Bb is A#, Db is C#, Eb is D#, Gb is F#
  "Eb Minor": ["D#", "F", "F#", "G#", "A#", "B", "C#"], // Gb is F#, Cb is B
  "Ab Minor": ["G#", "A#", "B", "C#", "D#", "E", "F#"], // Cb is B, Fb is E, Gb is F#
};


export const COMMON_OTHER_CHORDS = [
  "Isus4",
  "Vsus4",
  "vii°",
  "V7",
  "iv", // Minor iv chord is common in minor keys
  "III", // Major III chord is common in minor keys
];
// In your constants file (e.g., lib/constants.ts)

// In lib/constants.ts

export const TYPICAL_PROGRESSIONS = [
  // Your Original Progressions
  {
    name: 'Basic Progression (I-IV-V-I)',
    romanNumerals: ['I', 'IV', 'V', 'I'],
  },
  {
    name: 'Pop Progression (I-V-vi-IV)',
    romanNumerals: ['I', 'V', 'vi', 'IV'],
  },
  {
    name: 'Jazz Progression (ii-V-I)',
    romanNumerals: ['ii', 'V', 'I'],
  },
  {
    name: 'Doo-Wop Progression (I-vi-IV-V)',
    romanNumerals: ['I', 'vi', 'IV', 'V'],
  },

  // New Progressions with Secondary Dominants
  {
    name: 'Circle of Fifths (V7/V)',
    romanNumerals: ['I', 'IV', 'V7/V', 'V', 'I'],
  },
  {
    name: 'Pachelbel Canon variation',
    romanNumerals: ['I', 'V', 'V7/vi', 'vi', 'V7/IV', 'IV', 'I', 'V'],
  },
];
