import React, { useEffect, useCallback } from 'react';
import Staff from './Staff';
import { NOTE_LETTERS, SOLFEGE_NAMES, LETTER_TO_SOLFEGE } from '../data/notes';
import { playPianoNote } from '../audio/piano';

const STREAK_MILESTONES = [3, 5, 10, 15, 20];

export default function Quiz({ settings, quizState, onAnswer, onExclude, onQuit }) {
  const {
    currentNote,
    questionNumber,
    totalQuestions,
    score,
    feedback,
    correctAnswer,
    answerGiven,
    streak,
    bestStreak,
  } = quizState;

  const { nameMode, clef, playNote } = settings;

  // ── Play note on correct answer ───────────────────────────────────────────
  useEffect(() => {
    if (feedback === 'correct' && playNote) {
      playPianoNote(currentNote.id);
    }
  }, [feedback]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Keyboard input ────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (answerGiven) return;
      const key = e.key.toUpperCase();
      if (NOTE_LETTERS.includes(key)) {
        onAnswer(key);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [answerGiven, onAnswer]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const buttonLabel = (letter, idx) => {
    if (nameMode === 'solfege') return SOLFEGE_NAMES[idx];
    return letter;
  };

  const getButtonState = (letter) => {
    if (!answerGiven) return 'idle';
    if (letter === correctAnswer) return 'correct';
    return 'idle';
  };

  const clefLabel = currentNote.clef === 'treble' ? 'Vioolsleutel' : 'Bassleutel';

  const streakMessage = () => {
    if (streak > 0 && STREAK_MILESTONES.includes(streak)) {
      return `${streak} op rij!`;
    }
    return null;
  };

  const isInfinite = totalQuestions === Infinity;
  const progress = isInfinite ? 0 : ((questionNumber - 1) / totalQuestions) * 100;

  return (
    <div className="screen quiz-screen">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="quiz-topbar">
        <button className="quit-btn" onClick={onQuit} title="Stoppen">
          &#x2715;
        </button>

        <div className="progress-wrap">
          {isInfinite ? (
            <span className="progress-text" style={{ textAlign: 'left' }}>
              vraag {questionNumber}
            </span>
          ) : (
            <>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="progress-text">
                {questionNumber} / {totalQuestions}
              </span>
            </>
          )}
        </div>

        <div className="score-badge">
          {score} <span className="score-label">correct</span>
        </div>
      </div>

      {/* ── Streak display ──────────────────────────────────────────────── */}
      <div className="streak-row">
        {streak >= 2 && (
          <div className={`streak-badge ${streak >= 5 ? 'streak-hot' : ''}`}>
            <span className="streak-icon">&#x25B2;</span>
            <span className="streak-count">{streak}</span>
            <span className="streak-word">op rij</span>
          </div>
        )}
        {streakMessage() && streak >= 3 && (
          <div className="streak-milestone">{streakMessage()}</div>
        )}
        {bestStreak >= 3 && (
          <div className="best-streak">Best: {bestStreak}</div>
        )}
      </div>

      {/* ── Staff & note ────────────────────────────────────────────────── */}
      <div className={`staff-card ${feedback ? `staff-${feedback}` : ''}`}>
        <div className="clef-label">{clefLabel}</div>
        <Staff
          clef={currentNote.clef || clef}
          note={currentNote}
          feedback={feedback}
        />
        {feedback === 'wrong' && (
          <div className="wrong-hint">
            Correct: <strong>
              {nameMode === 'solfege'
                ? LETTER_TO_SOLFEGE[correctAnswer]
                : correctAnswer}
            </strong>
          </div>
        )}
      </div>

      {/* ── Exclude button ──────────────────────────────────────────────── */}
      {!answerGiven && (
        <div style={{ textAlign: 'center' }}>
          <button className="exclude-btn" onClick={onExclude}>
            Vraag niet meer
          </button>
        </div>
      )}

      {/* ── Answer buttons ──────────────────────────────────────────────── */}
      <div className="answer-grid">
        {NOTE_LETTERS.map((letter, idx) => {
          const state = getButtonState(letter);
          const isWrongGuess = answerGiven && feedback === 'wrong' && letter === quizState.guessedLetter;
          return (
            <button
              key={letter}
              className={`answer-btn ${state} ${isWrongGuess ? 'wrong-guess' : ''}`}
              onClick={() => onAnswer(letter)}
              disabled={answerGiven}
            >
              <span className="btn-main">
                {buttonLabel(letter, idx)}
              </span>
              <span className="btn-key">{letter}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
