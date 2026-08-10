const NOTE_SEMITONES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

let audioCtx = null;

function getCtx() {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

export async function playBuzz() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.4, now);
  master.connect(ctx.destination);

  const osc = ctx.createOscillator();
  const g = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.18);

  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(1, now + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

  osc.connect(g);
  g.connect(master);
  osc.start(now);
  osc.stop(now + 0.3);
}

export async function playPianoNote(noteId) {
  const ctx = getCtx();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  const letter = noteId[0];
  const octave = parseInt(noteId.slice(1));
  const midi = 12 * (octave + 1) + NOTE_SEMITONES[letter];
  const freq = 440 * Math.pow(2, (midi - 69) / 12);

  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.5, now);
  master.connect(ctx.destination);

  // Harmonics: [multiplier, amplitude] — triangle waves for a soft piano timbre
  [[1, 0.7], [2, 0.25], [3, 0.12], [4, 0.05], [5, 0.02]].forEach(([h, amp]) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = freq * h;

    // Fast attack, quick decay to sustain, then release
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(amp, now + 0.008);
    g.gain.exponentialRampToValueAtTime(amp * 0.35, now + 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    osc.connect(g);
    g.connect(master);
    osc.start(now);
    osc.stop(now + 1.5);
  });
}
