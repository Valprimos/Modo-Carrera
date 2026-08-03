import { useMemo, useState } from 'react';

// Fila cruda tal como llega de SQLite (snake_case), sin remapear aún al
// tipo Player del dominio -- eso se hará cuando el mapper esté en Fase 2.
export interface PlayerRow {
  id: string;
  first_name: string;
  last_name: string;
  position: string;
  nationality: string;
  current_ability: number;
  potential: number;
  value: number;
  morale: number;
  form: number;
}

type SortKey = keyof Pick<PlayerRow, 'current_ability' | 'potential' | 'value' | 'morale' | 'form'>;

export function SquadTable({ players }: { players: PlayerRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('current_ability');
  const [sortDesc, setSortDesc] = useState(true);
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    const list = players.filter((p) =>
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(filter.toLowerCase()) ||
      p.position.toLowerCase().includes(filter.toLowerCase()),
    );
    return [...list].sort((a, b) => (sortDesc ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]));
  }, [players, filter, sortKey, sortDesc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDesc((d) => !d);
    else {
      setSortKey(key);
      setSortDesc(true);
    }
  }

  return (
    <div>
      <input
        placeholder="Buscar jugador o posición..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: 12, width: 280 }}
      />
      <table className="data-table">
        <thead>
          <tr>
            <th>Jugador</th>
            <th>Pos.</th>
            <th>Nac.</th>
            <th onClick={() => toggleSort('current_ability')}>CA</th>
            <th onClick={() => toggleSort('potential')}>PA</th>
            <th onClick={() => toggleSort('value')}>Valor</th>
            <th onClick={() => toggleSort('morale')}>Moral</th>
            <th onClick={() => toggleSort('form')}>Forma</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id}>
              <td>{p.first_name} {p.last_name}</td>
              <td>{p.position}</td>
              <td>{p.nationality}</td>
              <td>{p.current_ability}</td>
              <td>{p.potential}</td>
              <td>€{p.value.toLocaleString('es-ES')}</td>
              <td>{p.morale}</td>
              <td>{p.form}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
