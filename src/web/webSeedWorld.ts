import type { Database } from 'sql.js';
import schemaSql from '../database/schema.sql?raw';
import { generateLeague } from '../generation/worldGenerator';
import { generateSquad, generateYouthProspects } from '../generation/playerGenerator';
import type { Player } from '../types/player';
import { getSqlJs } from './sqljsSetup';

const LEAGUE_DEFS: Array<{ name: string; country: string; tier: number }> = [
  { name: 'Liga Dorada', country: 'Hesperia', tier: 1 },
  { name: 'Segunda Dorada', country: 'Hesperia', tier: 2 },
  { name: 'Liga Imperial', country: 'Valtoria', tier: 1 },
];

/** Crea una base de datos sql.js vacía con el esquema ya aplicado. */
export async function createEmptyDatabase(): Promise<Database> {
  const SQL = await getSqlJs();
  const db = new SQL.Database();
  db.run(schemaSql);
  return db;
}

/** Reabre una base de datos previamente exportada (bytes) desde IndexedDB. */
export async function openDatabaseFromBytes(bytes: Uint8Array): Promise<Database> {
  const SQL = await getSqlJs();
  return new SQL.Database(bytes);
}

function insertPlayer(db: Database, player: Player, clubId: string): void {
  db.run(
    `INSERT INTO players (
      id, first_name, last_name, nationality, birth_date, height, weight,
      preferred_foot, position, secondary_positions, value, potential,
      current_ability, morale, form, personality, reputation, is_youth_prospect,
      club_id, salary, contract_expires_season, release_clause,
      attr_pases_cortos, attr_pases_largos, attr_regate, attr_control,
      attr_definicion, attr_tiro_lejano, attr_colocacion, attr_marcaje,
      attr_entradas, attr_velocidad, attr_aceleracion, attr_fuerza,
      attr_resistencia, attr_agresividad, attr_vision, attr_porteria
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      player.id, player.firstName, player.lastName, player.nationality, player.birthDate,
      player.height, player.weight, player.preferredFoot, player.position,
      JSON.stringify(player.secondaryPositions), player.value, player.potential,
      player.currentAbility, player.morale, player.form, player.personality,
      player.reputation, player.isYouthProspect ? 1 : 0, clubId,
      player.contract.salary, player.contract.expiresOnSeason, player.contract.releaseClause,
      player.attributes.technical.pasesCortos, player.attributes.technical.pasesLargos,
      player.attributes.technical.regate, player.attributes.technical.control,
      player.attributes.technical.definicion, player.attributes.technical.tiroLejano,
      player.attributes.technical.colocacion, player.attributes.technical.marcaje,
      player.attributes.technical.entradas, player.attributes.physical.velocidad,
      player.attributes.physical.aceleracion, player.attributes.physical.fuerza,
      player.attributes.physical.resistencia, player.attributes.physical.agresividad,
      player.attributes.mental.vision, player.attributes.goalkeeping.porteria,
    ],
  );
}

export function seedNewWorld(db: Database): void {
  db.run('BEGIN TRANSACTION');
  try {
    for (const def of LEAGUE_DEFS) {
      const { league, clubs } = generateLeague(def.name, def.country, def.tier);

      db.run(
        `INSERT INTO leagues (id, name, country, tier, promotion_slots, relegation_slots, has_national_cup)
         VALUES (?,?,?,?,?,?,?)`,
        [league.id, league.name, league.country, league.tier, league.promotionSlots, league.relegationSlots, league.hasNationalCup ? 1 : 0],
      );

      for (const club of clubs) {
        db.run(
          `INSERT INTO clubs (
            id, league_id, name, short_name, color_primary, color_secondary,
            crest_shape, reputation, fan_support, budget, transfer_budget,
            wage_budget, sponsor_income, ticket_income, stadium_name,
            stadium_capacity, youth_academy_level, training_facilities_level, manager_id
          ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NULL)`,
          [
            club.id, club.leagueId, club.name, club.shortName, club.colors.primary,
            club.colors.secondary, club.crest.shape, club.reputation, club.fanSupport,
            club.finances.budget, club.finances.transferBudget, club.finances.wageBudget,
            club.finances.sponsorIncomePerSeason, club.finances.ticketIncomePerSeason,
            club.facilities.stadiumName, club.facilities.stadiumCapacity,
            club.facilities.youthAcademyLevel, club.facilities.trainingFacilitiesLevel,
          ],
        );

        const squad = generateSquad(club.reputation, 23);
        const youth = generateYouthProspects(club.reputation, 8);
        for (const p of squad) insertPlayer(db, p, club.id);
        for (const p of youth) insertPlayer(db, p, club.id);
      }
    }

    db.run(`INSERT INTO meta (key, value) VALUES ('worldSeeded', '1')`);
    db.run(`INSERT INTO meta (key, value) VALUES ('currentSeason', ?)`, [String(new Date().getFullYear())]);
    db.run('COMMIT');
  } catch (err) {
    db.run('ROLLBACK');
    throw err;
  }
}
