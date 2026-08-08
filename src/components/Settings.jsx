import React, { useState } from 'react';

const CLEF_OPTIONS = [
  { value: 'treble', label: 'Solsleutel' },
  { value: 'bass',   label: 'Fasleutel' },
  { value: 'both',   label: 'Beide sleutels' },
];

const FILTER_OPTIONS = [
  { value: 'staff',    label: 'Balknoten (geen hulplijnen)' },
  { value: 'extremum', label: 'Enkel hulplijn-noten' },
  { value: 'all',      label: 'Standaard bereik' },
  { value: 'extended', label: 'Uitgebreid bereik (tot 3 hulplijnen)' },
];

const LENGTH_OPTIONS = [10, 20, 30, 50, Infinity];

const NAME_OPTIONS = [
  { value: 'solfege', label: 'Solfège (Do Re Mi...)' },
  { value: 'letters', label: 'Letternames (C D E...)' },
];

export default function Settings({ settings, onStart }) {
  const [local, setLocal] = useState(settings);

  const set = (key, val) => setLocal(prev => ({ ...prev, [key]: val }));

  return (
    <div className="screen settings-screen">
      <h1 className="app-title">Notenleer</h1>
      <p className="app-subtitle">Noten leren lezen</p>

      <div className="settings-card">
        <section className="setting-group">
          <h2>Sleutel</h2>
          <div className="radio-group">
            {CLEF_OPTIONS.map(o => (
              <label key={o.value} className={`radio-label ${local.clef === o.value ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="clef"
                  value={o.value}
                  checked={local.clef === o.value}
                  onChange={() => set('clef', o.value)}
                />
                {o.label}
              </label>
            ))}
          </div>
        </section>

        <section className="setting-group">
          <h2>Noten</h2>
          <div className="radio-group">
            {FILTER_OPTIONS.map(o => (
              <label key={o.value} className={`radio-label ${local.filter === o.value ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="filter"
                  value={o.value}
                  checked={local.filter === o.value}
                  onChange={() => set('filter', o.value)}
                />
                {o.label}
              </label>
            ))}
          </div>
        </section>

        <section className="setting-group">
          <h2>Antwoordweergave</h2>
          <div className="radio-group">
            {NAME_OPTIONS.map(o => (
              <label key={o.value} className={`radio-label ${local.nameMode === o.value ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="nameMode"
                  value={o.value}
                  checked={local.nameMode === o.value}
                  onChange={() => set('nameMode', o.value)}
                />
                {o.label}
              </label>
            ))}
          </div>
        </section>

        <section className="setting-group">
          <h2>Sessielengte</h2>
          <div className="pill-group">
            {LENGTH_OPTIONS.map(n => (
              <button
                key={n}
                className={`pill ${local.sessionLength === n ? 'active' : ''}`}
                onClick={() => set('sessionLength', n)}
              >
                {n === Infinity ? '∞' : n}
              </button>
            ))}
          </div>
        </section>

        <section className="setting-group">
          <h2>Pianotoon bij correct antwoord</h2>
          <div className="pill-group">
            <button
              className={`pill ${local.playNote ? 'active' : ''}`}
              onClick={() => set('playNote', true)}
            >
              Aan
            </button>
            <button
              className={`pill ${!local.playNote ? 'active' : ''}`}
              onClick={() => set('playNote', false)}
            >
              Uit
            </button>
          </div>
        </section>

      </div>

      <button className="start-btn" onClick={() => onStart(local)}>
        Start oefening
      </button>
    </div>
  );
}
