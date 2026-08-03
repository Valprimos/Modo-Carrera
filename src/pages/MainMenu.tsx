import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SaveMeta } from '@/types/career';
import { useSessionStore } from '@/hooks/useSessionStore';
import { gameApi } from '@/web/gameApi';

export function MainMenu() {
  const navigate = useNavigate();
  const setActiveSave = useSessionStore((s) => s.setActiveSave);
  const [saves, setSaves] = useState<SaveMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gameApi.saves.list().then((list) => {
      setSaves(list);
      setLoading(false);
    });
  }, []);

  async function handleLoad(save: SaveMeta) {
    const fresh = await gameApi.saves.load(save.id);
    setActiveSave(fresh);
    navigate('/dashboard');
  }

  async function handleDelete(saveId: string) {
    await gameApi.saves.delete(saveId);
    setSaves((prev) => prev.filter((s) => s.id !== saveId));
  }

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 40, margin: 0, letterSpacing: '-0.02em' }}>
          Modo Carrera <span style={{ color: 'var(--accent)' }}>FC</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
          Tu carrera de entrenador, desde la cantera hasta la gloria.
        </p>
      </div>

      <div className="panel" style={{ width: 480 }}>
        <button
          className="btn-primary"
          style={{ width: '100%', padding: '14px 18px', fontSize: 15 }}
          onClick={() => navigate('/new-game')}
        >
          + Nueva Partida
        </button>

        <div style={{ marginTop: 20 }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>
            PARTIDAS GUARDADAS
          </div>
          {loading && <div style={{ color: 'var(--text-secondary)' }}>Cargando...</div>}
          {!loading && saves.length === 0 && (
            <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              Todavía no hay partidas guardadas.
            </div>
          )}
          {saves.map((save) => (
            <div
              key={save.id}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 12px', borderRadius: 8, background: 'var(--bg-panel-raised)',
                marginBottom: 8,
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{save.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Temporada {save.currentSeason}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-secondary" onClick={() => handleLoad(save)}>Continuar</button>
                <button
                  className="btn-secondary"
                  style={{ color: 'var(--danger)' }}
                  onClick={() => handleDelete(save.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
