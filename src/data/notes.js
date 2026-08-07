// Staff position 0 = bottom line, +1 per half-step upward
// Treble clef: lines at 0(E4), 2(G4), 4(B4), 6(D5), 8(F5)
// Bass clef:   lines at 0(G2), 2(B2), 4(D3), 6(F3), 8(A3)

export const TREBLE_NOTES = [
  { id: 'F3', letter: 'F', solfege: 'Fa', octave: 3, position: -6, clef: 'treble' },
  { id: 'G3', letter: 'G', solfege: 'Sol',octave: 3, position: -5, clef: 'treble' },
  { id: 'A3', letter: 'A', solfege: 'La', octave: 3, position: -4, clef: 'treble' },
  { id: 'B3', letter: 'B', solfege: 'Si', octave: 3, position: -3, clef: 'treble' },
  { id: 'C4', letter: 'C', solfege: 'Do', octave: 4, position: -2, clef: 'treble' },
  { id: 'D4', letter: 'D', solfege: 'Re', octave: 4, position: -1, clef: 'treble' },
  { id: 'E4', letter: 'E', solfege: 'Mi', octave: 4, position:  0, clef: 'treble' },
  { id: 'F4', letter: 'F', solfege: 'Fa', octave: 4, position:  1, clef: 'treble' },
  { id: 'G4', letter: 'G', solfege: 'Sol',octave: 4, position:  2, clef: 'treble' },
  { id: 'A4', letter: 'A', solfege: 'La', octave: 4, position:  3, clef: 'treble' },
  { id: 'B4', letter: 'B', solfege: 'Si', octave: 4, position:  4, clef: 'treble' },
  { id: 'C5', letter: 'C', solfege: 'Do', octave: 5, position:  5, clef: 'treble' },
  { id: 'D5', letter: 'D', solfege: 'Re', octave: 5, position:  6, clef: 'treble' },
  { id: 'E5', letter: 'E', solfege: 'Mi', octave: 5, position:  7, clef: 'treble' },
  { id: 'F5', letter: 'F', solfege: 'Fa', octave: 5, position:  8, clef: 'treble' },
  { id: 'G5', letter: 'G', solfege: 'Sol',octave: 5, position:  9, clef: 'treble' },
  { id: 'A5', letter: 'A', solfege: 'La', octave: 5, position: 10, clef: 'treble' },
  { id: 'B5', letter: 'B', solfege: 'Si', octave: 5, position: 11, clef: 'treble' },
  { id: 'C6', letter: 'C', solfege: 'Do', octave: 6, position: 12, clef: 'treble' },
  { id: 'D6', letter: 'D', solfege: 'Re', octave: 6, position: 13, clef: 'treble' },
  { id: 'E6', letter: 'E', solfege: 'Mi', octave: 6, position: 14, clef: 'treble' },
];

export const BASS_NOTES = [
  { id: 'A1', letter: 'A', solfege: 'La', octave: 1, position: -6, clef: 'bass' },
  { id: 'B1', letter: 'B', solfege: 'Si', octave: 1, position: -5, clef: 'bass' },
  { id: 'C2', letter: 'C', solfege: 'Do', octave: 2, position: -4, clef: 'bass' },
  { id: 'D2', letter: 'D', solfege: 'Re', octave: 2, position: -3, clef: 'bass' },
  { id: 'E2', letter: 'E', solfege: 'Mi', octave: 2, position: -2, clef: 'bass' },
  { id: 'F2', letter: 'F', solfege: 'Fa', octave: 2, position: -1, clef: 'bass' },
  { id: 'G2', letter: 'G', solfege: 'Sol',octave: 2, position:  0, clef: 'bass' },
  { id: 'A2', letter: 'A', solfege: 'La', octave: 2, position:  1, clef: 'bass' },
  { id: 'B2', letter: 'B', solfege: 'Si', octave: 2, position:  2, clef: 'bass' },
  { id: 'C3', letter: 'C', solfege: 'Do', octave: 3, position:  3, clef: 'bass' },
  { id: 'D3', letter: 'D', solfege: 'Re', octave: 3, position:  4, clef: 'bass' },
  { id: 'E3', letter: 'E', solfege: 'Mi', octave: 3, position:  5, clef: 'bass' },
  { id: 'F3', letter: 'F', solfege: 'Fa', octave: 3, position:  6, clef: 'bass' },
  { id: 'G3', letter: 'G', solfege: 'Sol',octave: 3, position:  7, clef: 'bass' },
  { id: 'A3', letter: 'A', solfege: 'La', octave: 3, position:  8, clef: 'bass' },
  { id: 'B3', letter: 'B', solfege: 'Si', octave: 3, position:  9, clef: 'bass' },
  { id: 'C4', letter: 'C', solfege: 'Do', octave: 4, position: 10, clef: 'bass' },
  { id: 'D4', letter: 'D', solfege: 'Re', octave: 4, position: 11, clef: 'bass' },
  { id: 'E4', letter: 'E', solfege: 'Mi', octave: 4, position: 12, clef: 'bass' },
  { id: 'F4', letter: 'F', solfege: 'Fa', octave: 4, position: 13, clef: 'bass' },
  { id: 'G4', letter: 'G', solfege: 'Sol',octave: 4, position: 14, clef: 'bass' },
];

export const NOTE_LETTERS  = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const SOLFEGE_NAMES = ['Do','Re','Mi','Fa','Sol','La','Si'];
// Map letter → solfege for keyboard hints
export const LETTER_TO_SOLFEGE = { C:'Do', D:'Re', E:'Mi', F:'Fa', G:'Sol', A:'La', B:'Si' };
