import React from 'react';

// ── Layout constants ──────────────────────────────────────────────────────────
const BOTTOM_Y    = 118;  // Y of bottom staff line (position 0)
const HALF_STEP   = 7;    // px per staff step (half the distance between adjacent lines)
const NOTE_X      = 220;  // X of note head
const STAFF_LEFT  = 68;   // X where staff lines start
const STAFF_RIGHT = 340;  // X where staff lines end
const LEDGER_HALF = 16;   // half-width of ledger lines

// Convert staff position → SVG Y coordinate
const posToY = (pos) => BOTTOM_Y - pos * HALF_STEP;

// Which ledger lines need to be drawn for this note position?
function getLedgerLines(pos) {
  const lines = [];
  if (pos < 0) {
    // Draw ledger lines from -2 downward to the lowest required position.
    // For pos=-1 (space just below staff) we still show the -2 ledger line.
    const lowest = Math.min(pos, -2);
    for (let n = -2; n >= lowest; n -= 2) lines.push(n);
  } else if (pos > 8) {
    // Draw ledger lines from 10 upward to the highest required position.
    // For pos=9 (space just above staff) we show the +10 ledger line.
    const highest = Math.max(pos, 10);
    for (let n = 10; n <= highest; n += 2) lines.push(n);
  }
  return lines;
}

export default function Staff({ clef, note, feedback }) {
  const noteY    = posToY(note.position);
  const stemUp   = note.position <= 4;
  const ledgers  = getLedgerLines(note.position);

  const noteColor =
    feedback === 'correct' ? '#16a34a' :
    feedback === 'wrong'   ? '#dc2626' :
    '#0f172a';

  const stemX    = stemUp ? NOTE_X + 8.5 : NOTE_X - 8.5;
  const stemEndY = stemUp ? noteY - 44   : noteY + 44;

  return (
    <svg
      viewBox="0 0 390 182"
      width="100%"
      style={{ maxWidth: 480, display: 'block', margin: '0 auto' }}
      aria-label={`Noot op de notenbalk`}
    >
      {/* ── Staff lines ──────────────────────────────────────────────────── */}
      {[0, 2, 4, 6, 8].map(p => (
        <line
          key={p}
          x1={STAFF_LEFT} y1={posToY(p)}
          x2={STAFF_RIGHT} y2={posToY(p)}
          stroke="#0f172a" strokeWidth={1.5}
        />
      ))}

      {/* Opening barline */}
      <line
        x1={STAFF_LEFT} y1={posToY(8)}
        x2={STAFF_LEFT} y2={posToY(0)}
        stroke="#0f172a" strokeWidth={2}
      />

      {/* ── Clef symbol ──────────────────────────────────────────────────── */}
      {clef === 'treble' ? (
        <text
          x={14}
          y={posToY(0) + 6}
          fontSize={90}
          fontFamily='"Times New Roman", "FreeSerif", "Noto Music", serif'
          fill="#0f172a"
          dominantBaseline="auto"
          style={{ userSelect: 'none' }}
        >
          {'𝄞'}
        </text>
      ) : (
        <text
          x={16}
          y={posToY(0) - 16}
          fontSize={60}
          fontFamily='"Times New Roman", "FreeSerif", "Noto Music", serif'
          fill="#0f172a"
          dominantBaseline="auto"
          style={{ userSelect: 'none' }}
        >
          {'𝄢'}
        </text>
      )}

      {/* ── Ledger lines ─────────────────────────────────────────────────── */}
      {ledgers.map(p => (
        <line
          key={p}
          x1={NOTE_X - LEDGER_HALF} y1={posToY(p)}
          x2={NOTE_X + LEDGER_HALF} y2={posToY(p)}
          stroke="#0f172a" strokeWidth={1.5}
        />
      ))}

      {/* ── Stem ─────────────────────────────────────────────────────────── */}
      <line
        x1={stemX} y1={noteY}
        x2={stemX} y2={stemEndY}
        stroke={noteColor} strokeWidth={1.8}
      />

      {/* ── Note head ────────────────────────────────────────────────────── */}
      <ellipse
        cx={NOTE_X}
        cy={noteY}
        rx={8.5}
        ry={6}
        fill={noteColor}
        transform={`rotate(-18, ${NOTE_X}, ${noteY})`}
      />
    </svg>
  );
}
