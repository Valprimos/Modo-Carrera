-- Esquema de una partida guardada. Cada save es un archivo .sqlite propio,
-- así "varias partidas" (requisito del brief) es trivial: un archivo por save.

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leagues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  tier INTEGER NOT NULL,
  promotion_slots INTEGER NOT NULL,
  relegation_slots INTEGER NOT NULL,
  has_national_cup INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS clubs (
  id TEXT PRIMARY KEY,
  league_id TEXT NOT NULL REFERENCES leagues(id),
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  color_primary TEXT NOT NULL,
  color_secondary TEXT NOT NULL,
  crest_shape TEXT NOT NULL,
  reputation INTEGER NOT NULL,
  fan_support INTEGER NOT NULL,
  budget INTEGER NOT NULL,
  transfer_budget INTEGER NOT NULL,
  wage_budget INTEGER NOT NULL,
  sponsor_income INTEGER NOT NULL,
  ticket_income INTEGER NOT NULL,
  stadium_name TEXT NOT NULL,
  stadium_capacity INTEGER NOT NULL,
  youth_academy_level INTEGER NOT NULL,
  training_facilities_level INTEGER NOT NULL,
  manager_id TEXT
);

CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  nationality TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  height INTEGER NOT NULL,
  weight INTEGER NOT NULL,
  preferred_foot TEXT NOT NULL,
  position TEXT NOT NULL,
  secondary_positions TEXT NOT NULL DEFAULT '[]', -- JSON array
  value INTEGER NOT NULL,
  potential INTEGER NOT NULL,
  current_ability INTEGER NOT NULL,
  morale INTEGER NOT NULL,
  form INTEGER NOT NULL,
  personality TEXT NOT NULL,
  reputation INTEGER NOT NULL,
  is_youth_prospect INTEGER NOT NULL DEFAULT 0,
  club_id TEXT REFERENCES clubs(id),
  salary INTEGER NOT NULL,
  contract_expires_season INTEGER,
  release_clause INTEGER,
  -- atributos, todos 1-99
  attr_pases_cortos INTEGER NOT NULL,
  attr_pases_largos INTEGER NOT NULL,
  attr_regate INTEGER NOT NULL,
  attr_control INTEGER NOT NULL,
  attr_definicion INTEGER NOT NULL,
  attr_tiro_lejano INTEGER NOT NULL,
  attr_colocacion INTEGER NOT NULL,
  attr_marcaje INTEGER NOT NULL,
  attr_entradas INTEGER NOT NULL,
  attr_velocidad INTEGER NOT NULL,
  attr_aceleracion INTEGER NOT NULL,
  attr_fuerza INTEGER NOT NULL,
  attr_resistencia INTEGER NOT NULL,
  attr_agresividad INTEGER NOT NULL,
  attr_vision INTEGER NOT NULL,
  attr_porteria INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS player_injuries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id TEXT NOT NULL REFERENCES players(id),
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  days_remaining INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS managers (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  nationality TEXT NOT NULL,
  club_id TEXT REFERENCES clubs(id),
  reputation INTEGER NOT NULL,
  board_confidence INTEGER NOT NULL,
  season_objective TEXT NOT NULL,
  is_human INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS fixtures (
  id TEXT PRIMARY KEY,
  league_id TEXT NOT NULL REFERENCES leagues(id),
  season INTEGER NOT NULL,
  round INTEGER NOT NULL,
  home_club_id TEXT NOT NULL REFERENCES clubs(id),
  away_club_id TEXT NOT NULL REFERENCES clubs(id),
  played INTEGER NOT NULL DEFAULT 0,
  home_goals INTEGER,
  away_goals INTEGER,
  match_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tactics (
  club_id TEXT PRIMARY KEY REFERENCES clubs(id),
  formation TEXT NOT NULL,
  style TEXT NOT NULL,
  pressing INTEGER NOT NULL,
  width INTEGER NOT NULL,
  tempo INTEGER NOT NULL,
  defensive_line INTEGER NOT NULL,
  set_piece_taker TEXT
);

CREATE INDEX IF NOT EXISTS idx_players_club ON players(club_id);
CREATE INDEX IF NOT EXISTS idx_clubs_league ON clubs(league_id);
CREATE INDEX IF NOT EXISTS idx_fixtures_league_season ON fixtures(league_id, season);
