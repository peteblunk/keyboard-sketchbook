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

export const DEMO_MELODY: { note: string; duration: string; time: number | string }[] = [
  { note: "B3", duration: "8n", time: 0 },
  { note: "C#4", duration: "8n", time: "0:0:2" },
  { note: "D4", duration: "8n", time: "0:1" },
  { note: "E4", duration: "8n", time: "0:1:2" },
  { note: "F#4", duration: "8n", time: "0:2" },
  { note: "G4", duration: "4n", time: "0:2:2" },
  { note: "F#4", duration: "8n", time: "0:3:2" },
  { note: "E4", duration: "8n", time: "1:0" },
  { note: "D4", duration: "8n", time: "1:0:2" },
  { note: "C#4", duration: "8n", time: "1:1" },
  { note: "B3", duration: "4n", time: "1:1:2" },
  { note: "A3", duration: "4n", time: "1:2:2" },
  { note: "B3", duration: "4n", time: "1:3:2" },
  { note: "C#4", duration: "4n", time: "2:0:2" },
  { note: "D4", duration: "2n", time: "2:1:2" },
  { note: "B3", duration: "2n", time: "2:3:2" },
];
