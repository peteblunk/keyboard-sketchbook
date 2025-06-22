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
