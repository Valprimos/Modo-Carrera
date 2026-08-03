import { useEffect, useState } from 'react';
import { useSessionStore } from '@/hooks/useSessionStore';
import { ClubCrest } from '@/components/ClubCrest';
import { SquadTable, type PlayerRow } from '@/components/SquadTable';

interface LeagueRow { id: string; name: string; country: string; tier: number; }
interface ClubRow {
  id: string; name: string; short_name: string; reputation: number;
  color_primary: string; color_secondary: string; crest_shape: 'shield' | 'circle' | 'hexagon';
}

export function Dashboard() {
  const activeSave = useSessionStore((s) => s.activeSave);
  const [leagues, setLeagues] = useState<LeagueRow[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [clubs, setClubs] = useState<ClubRow[]>([]);
  const [selectedClub, setSelectedClub] = useState<ClubRow | null>(null);
  const [squad, setSquad] = useState<PlayerRow[]>([]);
  const [playerCount, setPlayerCount] = useState<number | null>(null);

  useEffect(() => {
    if (!activeSave) return;
    window.fm.db.query<LeagueRow[]>('leagues', { dbFileName: activeSave.dbFileName }).then((ls) => {
      setLeagues(ls);
      if (ls[0]) setSelectedLeague(ls[0].id);
    });
    window.fm.db.query<number>('playerCount', { dbFileName: activeSave.dbFileName }).then(setPlayerCount);
  }, [activeSave]);

  useEffect(() => {
    if (!activeSave || !selectedLeague) return;
    window.fm.db.query<ClubRow[]>('clubsInLeague', {
      dbFileName: activeSave.dbFileName,
      leagueId: selectedLeague,
    }).then((cs) => {
      setClubs(cs);
      setSelectedClub(null);
      setSquad([]);
    });
  }, [activeSave, selectedLeague]);

  useEffect(() => {
    if (!activeSave || !selectedClub) return;
    window.fm.db.query<PlayerRow[]>('squad', {
      dbFileName: activeSave.dbFileName,
      clubId: selectedClub.id,
    }).then(setSquad);
  }, [activeSave, selectedClub]);

  if (!activeSave) {
    return <div className="main-content">No hay ninguna partida activa. Vuelve al menú principal.</div>;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div style={{ padding: '0 8px', fontWeight: 700, fontSize: 16 }}>{activeSave.name}</div>
        <div style={{ padding: '0 8px', fontSize: 12, color: 'var(--text-secondary)' }}>
          Temporada {activeSave.currentSeason}
          {playerCount !== null && <> · {playerCount.toLocaleString('es-ES')} jugadores</>}
        </div>

        <div className="sidebar-title">Ligas</div>
        {leagues.map((l) => (
          <a
            key={l.id}
            className={`sidebar-link ${selectedLeague === l.id ? 'active' : ''}`}
            onClick={() => setSelectedLeague(l.id)}
          >
            {l.name} <span style={{ opacity: 0.6 }}>({l.country})</span>
          </a>
        ))}
      </aside>

      <main className="main-content">
        {!selectedClub && (
          <>
            <h2 style={{ marginTop: 0 }}>Clubes</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {clubs.map((c) => (
                <button
                  key={c.id}
                  className="panel"
                  style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--border)', background: 'var(--bg-panel-raised)' }}
                  onClick={() => setSelectedClub(c)}
                >
                  <ClubCrest shape={c.crest_shape} primary={c.color_primary} secondary={c.color_secondary} size={36} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Reputación {c.reputation}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {selectedClub && (
          <>
            <button className="btn-secondary" style={{ marginBottom: 16 }} onClick={() => setSelectedClub(null)}>
              ← Volver a clubes
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <ClubCrest shape={selectedClub.crest_shape} primary={selectedClub.color_primary} secondary={selectedClub.color_secondary} size={48} />
              <h2 style={{ margin: 0 }}>{selectedClub.name}</h2>
            </div>
            <SquadTable players={squad} />
          </>
        )}
      </main>
    </div>
  );
}
