import React from 'react';
import { LETTER_TO_SOLFEGE } from '../data/notes';

export default function Results({ settings, quizState, onRestart, onSettings }) {
  const { score, history, wrongNotes, bestStreak } = quizState;
  const { nameMode, showOctave } = settings;
  const total = history.length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  // Sort wrong notes by frequency
  const wrongList = Object.entries(wrongNotes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const noteLabel = (noteId) => {
    const letter = noteId[0]; // e.g. 'C' from 'C4'
    const octave = noteId.slice(1);
    if (nameMode === 'solfege') {
      return showOctave
        ? `${LETTER_TO_SOLFEGE[letter]}${octave}`
        : LETTER_TO_SOLFEGE[letter];
    }
    return showOctave ? noteId : letter;
  };

  const grade = pct >= 90 ? 'Uitstekend!' : pct >= 70 ? 'Goed zo!' : pct >= 50 ? 'Blijven oefenen' : 'Oefening baart kunst';

  return (
    <div className="screen results-screen">
      <h1 className="results-title">{grade}</h1>

      <div className="results-score-ring">
        <svg viewBox="0 0 120 120" width="140" height="140">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="50"
            fill="none"
            stroke={pct >= 70 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'}
            strokeWidth="10"
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
          <text x="60" y="55" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0f172a">
            {pct}%
          </text>
          <text x="60" y="74" textAnchor="middle" fontSize="11" fill="#64748b">
            {score}/{total}
          </text>
        </svg>
      </div>

      <div className="results-stats">
        <div className="stat-item">
          <span className="stat-value">{score}</span>
          <span className="stat-label">Correct</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{total - score}</span>
          <span className="stat-label">Fout</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{bestStreak}</span>
          <span className="stat-label">Beste reeks</span>
        </div>
      </div>

      {wrongList.length > 0 && (
        <div className="wrong-notes-section">
          <h3>Moeilijkste noten</h3>
          <div className="wrong-notes-list">
            {wrongList.map(([id, count]) => (
              <div key={id} className="wrong-note-item">
                <span className="wrong-note-name">{noteLabel(id)}</span>
                <span className="wrong-note-bar">
                  <span
                    className="wrong-note-fill"
                    style={{ width: `${Math.min(100, count * 20)}%` }}
                  />
                </span>
                <span className="wrong-note-count">{count}x fout</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="results-actions">
        <button className="start-btn" onClick={onRestart}>
          Opnieuw spelen
        </button>
        <button className="secondary-btn" onClick={onSettings}>
          Instellingen
        </button>
      </div>
    </div>
  );
}
