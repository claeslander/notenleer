import React, { useState, useCallback } from 'react';
import { TREBLE_NOTES, BASS_NOTES } from './data/notes';
import Settings from './components/Settings';
import Quiz from './components/Quiz';
import Results from './components/Results';

// ── Note filtering ────────────────────────────────────────────────────────────

function filterNotes(notes, filter) {
  switch (filter) {
    case 'staff':    return notes.filter(n => n.position >= 0 && n.position <= 8);
    case 'extremum': return notes.filter(n => n.position < 0 || n.position > 8);
    case 'all':      return notes.filter(n => n.position >= -2 && n.position <= 12);
    case 'extended': return notes;
    default:         return notes;
  }
}

function getActiveNotes(clef, filter) {
  const pool =
    clef === 'treble' ? TREBLE_NOTES :
    clef === 'bass'   ? BASS_NOTES   :
    [...TREBLE_NOTES, ...BASS_NOTES];
  return filterNotes(pool, filter);
}

// ── Weighted random note picker ───────────────────────────────────────────────

function pickNote(notes, weights, lastId) {
  // Avoid same note twice in a row when possible
  const candidates = notes.length > 1 ? notes.filter(n => n.id !== lastId) : notes;
  const total = candidates.reduce((s, n) => s + (weights[n.id] ?? 1), 0);
  let rnd = Math.random() * total;
  for (const note of candidates) {
    rnd -= weights[note.id] ?? 1;
    if (rnd <= 0) return note;
  }
  return candidates[candidates.length - 1];
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState('settings');
  const [settings, setSettings] = useState({
    clef: 'treble',
    filter: 'staff',
    nameMode: 'solfege',
    sessionLength: 20,
    showOctave: false,
  });
  const [quizState, setQuizState] = useState(null);
  const [excludedIds, setExcludedIds] = useState(new Set());

  // ── Start new quiz ──────────────────────────────────────────────────────
  const startQuiz = useCallback((newSettings, keepExclusions = false) => {
    setExcludedIds(prev => {
      const excluded = keepExclusions ? prev : new Set();
      const allNotes = getActiveNotes(newSettings.clef, newSettings.filter);
      const notes = allNotes.filter(n => !excluded.has(n.id));
      if (notes.length === 0) return prev; // safety: don't start if all excluded

      const weights = Object.fromEntries(notes.map(n => [n.id, 1]));
      const first   = pickNote(notes, weights, null);

      setSettings(newSettings);
      setQuizState({
        activeNotes: notes,
      weights,
      currentNote: first,
      questionNumber: 1,
      totalQuestions: newSettings.sessionLength,
        score: 0,
        wrongNotes: {},
        history: [],
        feedback: null,
        correctAnswer: null,
        guessedLetter: null,
        answerGiven: false,
        streak: 0,
        bestStreak: 0,
      });
      setScreen('quiz');
      return excluded;
    });
  }, []);

  // ── Exclude current note ────────────────────────────────────────────────
  const handleExclude = useCallback(() => {
    setQuizState(prev => {
      if (!prev || prev.answerGiven) return prev;
      const remaining = prev.activeNotes.filter(n => n.id !== prev.currentNote.id);
      if (remaining.length === 0) return prev;
      setExcludedIds(ids => new Set([...ids, prev.currentNote.id]));
      const nextNote = pickNote(remaining, prev.weights, prev.currentNote.id);
      return {
        ...prev,
        activeNotes: remaining,
        currentNote: nextNote,
      };
    });
  }, []);

  // ── Handle an answer ────────────────────────────────────────────────────
  const handleAnswer = useCallback((letter) => {
    setQuizState(prev => {
      if (!prev || prev.answerGiven) return prev;

      const { currentNote, weights, activeNotes, questionNumber, totalQuestions,
              score, wrongNotes, history, streak, bestStreak } = prev;

      const isCorrect = letter === currentNote.letter;

      // Update spaced-repetition weights
      const newWeights = { ...weights };
      if (isCorrect) {
        newWeights[currentNote.id] = Math.max(1, (newWeights[currentNote.id] ?? 1) * 0.75);
      } else {
        newWeights[currentNote.id] = Math.min(6, (newWeights[currentNote.id] ?? 1) * 2);
      }

      const newStreak    = isCorrect ? streak + 1 : 0;
      const newBestStreak = Math.max(bestStreak, newStreak);

      const newWrongNotes = { ...wrongNotes };
      if (!isCorrect) {
        newWrongNotes[currentNote.id] = (newWrongNotes[currentNote.id] ?? 0) + 1;
      }

      const newHistory = [...history, { note: currentNote, correct: isCorrect, answered: letter }];
      const newScore   = isCorrect ? score + 1 : score;
      const isLastQ    = questionNumber >= totalQuestions;

      const next = {
        ...prev,
        weights:      newWeights,
        wrongNotes:   newWrongNotes,
        history:      newHistory,
        score:        newScore,
        feedback:     isCorrect ? 'correct' : 'wrong',
        correctAnswer: currentNote.letter,
        guessedLetter: letter,
        answerGiven:  true,
        streak:       newStreak,
        bestStreak:   newBestStreak,
      };

      // Schedule advancing to next note or results screen
      const delay = isCorrect ? 480 : 1600;
      setTimeout(() => {
        if (isLastQ) {
          setScreen('results');
          setQuizState(s => ({ ...s, feedback: null, answerGiven: false }));
        } else {
          const nextNote = pickNote(activeNotes, newWeights, currentNote.id);
          setQuizState(s => ({
            ...s,
            currentNote:   nextNote,
            questionNumber: questionNumber + 1,
            feedback:      null,
            correctAnswer: null,
            guessedLetter: null,
            answerGiven:   false,
          }));
        }
      }, delay);

      return next;
    });
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {screen === 'settings' && (
        <Settings settings={settings} onStart={startQuiz} />
      )}
      {screen === 'quiz' && quizState && (
        <Quiz
          settings={settings}
          quizState={quizState}
          onAnswer={handleAnswer}
          onExclude={handleExclude}
          onQuit={() => setScreen('settings')}
        />
      )}
      {screen === 'results' && quizState && (
        <Results
          settings={settings}
          quizState={quizState}
          onRestart={() => startQuiz(settings, true)}
          onSettings={() => { setExcludedIds(new Set()); setScreen('settings'); }}
        />
      )}
    </div>
  );
}
