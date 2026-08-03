import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '@/hooks/useSessionStore';
import { gameApi } from '@/web/gameApi';

const NATIONALITIES = [
  'España', 'Argentina', 'Brasil', 'Inglaterra', 'Francia', 'Alemania',
  'Italia', 'Portugal', 'Países Bajos', 'Bélgica', 'Croacia', 'Uruguay',
];

export function NewGame() {
  const navigate = useNavigate();
  const setActiveSave = useSessionStore((s) => s.setActiveSave);

  const [saveName, setSaveName] = useState('Mi Carrera');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationality, setNationality] = useState(NATIONALITIES[0] ?? 'España');
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    if (!firstName.trim() || !lastName.trim()) return;
    setCreating(true);
    try {
      const save = await gameApi.saves.create(saveName, {
        managerFirstName: firstName,
        managerLastName: lastName,
        nationality,
      });
      setActiveSave(save);
      navigate('/dashboard');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <div className="panel" style={{ width: 480 }}>
        <h2 style={{ marginTop: 0 }}>Nueva Partida</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: -8 }}>
          Se generará un mundo nuevo: ligas, clubes y miles de jugadores.
        </p>

        <Field label="Nombre de la partida">
          <input value={saveName} onChange={(e) => setSaveName(e.target.value)} style={{ width: '100%' }} />
        </Field>

        <div style={{ display: 'flex', gap: 12 }}>
          <Field label="Nombre del entrenador">
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ width: '100%' }} />
          </Field>
          <Field label="Apellido">
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ width: '100%' }} />
          </Field>
        </div>

        <Field label="Nacionalidad">
          <select value={nationality} onChange={(e) => setNationality(e.target.value)} style={{ width: '100%' }}>
            {NATIONALITIES.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </Field>

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button className="btn-secondary" onClick={() => navigate('/')}>Volver</button>
          <button
            className="btn-primary"
            style={{ flex: 1 }}
            disabled={creating || !firstName.trim() || !lastName.trim()}
            onClick={handleCreate}
          >
            {creating ? 'Generando mundo...' : 'Empezar Carrera'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14, flex: 1 }}>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}
