import type Database from 'better-sqlite3';
import { generateLeague } from '../generation/worldGenerator';
import { generateSquad, generateYouthProspects } from '../generation/playerGenerator';
import type { Player } from '../../src/types/player';

const LEAGUE_DEFS: Array<{ name: string; country: string; tier: number }> = [
  { name: 'Liga Dorada', country: 'Hesperia', tier: 1 },
  { name: 'Segunda Dorada', country: 'Hesperia', tier: 2 },
  { name: 'Liga Imperial', country: 'Valtoria', tier: 1 },
];

function insertPlayer(db: Database.Database, player: Player, clubId: string | null): void {
  db.prepare(`
    INSERT INTO players (
      id, first_name, last_name, nationality, birth_date, height, weight,
      preferred_foot, position, secondary_positions, value, potential,
      current_ability, morale, form, personality, reputation, is_youth_prospect,
      club_id, salary, contract_expires_season, release_clause,
      attr_pases_cortos, attr_pases_largos, attr_regate, attr_control,
      attr_definicion, attr_tiro_lejano, attr_colocacion, attr_marcaje,
      attr_entradas, attr_velocidad, attr_aceleracion, attr_fuerza,
      attr_resistencia, attr_agresividad, attr_vision, attr_porteria
    ) VALUES (
      @id, @firstName, @lastName, @nationality, @birthDate, @height, @weight,
      @preferredFoot, @position, @secondaryPositions, @value, @potential,
      @currentAbility, @morale, @form, @personality, @reputation, @isYouthProspect,
      @clubId, @salary, @contractExpiresSeason, @releaseClause,
      @pasesCortos, @pasesLargos, @regate, @control,
      @definicion, @tiroLejano, @colocacion, @marcaje,
      @entradas, @velocidad, @aceleracion, @fuerza,
      @resistencia, @agresividad, @vision, @porteria
    )
  `).run({
    id: player.id,
    firstName: player.firstName,
    lastName: player.lastName,
    nationality: player.nationality,
    birthDate: player.birthDate,
    height: player.height,
    weight: player.weight,
    preferredFoot: player.preferredFoot,
    position: player.position,
    secondaryPositions: JSON.stringify(player.secondaryPositions),
    value: player.value,
    potential: player.potential,
    currentAbility: player.currentAbility,
    morale: player.morale,
    form: player.form,
    personality: player.personality,
    reputation: player.reputation,
    isYouthProspect: player.isYouthProspect ? 1 : 0,
    clubId,
    salary: player.contract.salary,
    contractExpiresSeason: player.contract.expiresOnSeason,
    releaseClause: player.contract.releaseClause,
    pasesCortos: player.attributes.technical.pasesCortos,
    pasesLargos: player.attributes.technical.pasesLargos,
    regate: player.attributes.technical.regate,
    control: player.attributes.technical.control,
    definicion: player.attributes.technical.definicion,
    tiroLejano: player.attributes.technical.tiroLejano,
    colocacion: player.attributes.technical.colocacion,
    marcaje: player.attributes.technical.marcaje,
    entradas: player.attributes.technical.entradas,
    velocidad: player.attributes.physical.velocidad,
    aceleracion: player.attributes.physical.aceleracion,
    fuerza: player.attributes.physical.fuerza,
    resistencia: player.attributes.physical.resistencia,
    agresividad: player.attributes.physical.agresividad,
    vision: player.attributes.mental.vision,
    porteria: player.attributes.goalkeeping.porteria,
  });
}

/**
 * Puebla una base de datos de partida recién creada con ligas, clubes y
 * miles de jugadores ficticios, tal como pide el brief. Se ejecuta dentro
 * de una transacción para que sea rápido incluso con miles de filas.
 */
export function seedNewWorld(db: Database.Database): void {
  const seedTx = db.transaction(() => {
    const insertLeague = db.prepare(`
      INSERT INTO leagues (id, name, country, tier, promotion_slots, relegation_slots, has_national_cup)
      VALUES (@id, @name, @country, @tier, @promotionSlots, @relegationSlots, @hasNationalCup)
    `);
    const insertClub = db.prepare(`
      INSERT INTO clubs (
        id, league_id, name, short_name, color_primary, color_secondary,
        crest_shape, reputation, fan_support, budget, transfer_budget,
        wage_budget, sponsor_income, ticket_income, stadium_name,
        stadium_capacity, youth_academy_level, training_facilities_level, manager_id
      ) VALUES (
        @id, @leagueId, @name, @shortName, @colorPrimary, @colorSecondary,
        @crestShape, @reputation, @fanSupport, @budget, @transferBudget,
        @wageBudget, @sponsorIncome, @ticketIncome, @stadiumName,
        @stadiumCapacity, @youthAcademyLevel, @trainingFacilitiesLevel, NULL
      )
    `);

    for (const def of LEAGUE_DEFS) {
      const { league, clubs } = generateLeague(def.name, def.country, def.tier);

      insertLeague.run({
        id: league.id,
        name: league.name,
        country: league.country,
        tier: league.tier,
        promotionSlots: league.promotionSlots,
        relegationSlots: league.relegationSlots,
        hasNationalCup: league.hasNationalCup ? 1 : 0,
      });

      for (const club of clubs) {
        insertClub.run({
          id: club.id,
          leagueId: club.leagueId,
          name: club.name,
          shortName: club.shortName,
          colorPrimary: club.colors.primary,
          colorSecondary: club.colors.secondary,
          crestShape: club.crest.shape,
          reputation: club.reputation,
          fanSupport: club.fanSupport,
          budget: club.finances.budget,
          transferBudget: club.finances.transferBudget,
          wageBudget: club.finances.wageBudget,
          sponsorIncome: club.finances.sponsorIncomePerSeason,
          ticketIncome: club.finances.ticketIncomePerSeason,
          stadiumName: club.facilities.stadiumName,
          stadiumCapacity: club.facilities.stadiumCapacity,
          youthAcademyLevel: club.facilities.youthAcademyLevel,
          trainingFacilitiesLevel: club.facilities.trainingFacilitiesLevel,
        });

        // Plantilla (23) + cantera (8) por club. Con ~60 clubes en total
        // (3 ligas x 20), esto genera varios miles de jugadores, como pide el brief.
        const squad = generateSquad(club.reputation, 23);
        const youth = generateYouthProspects(club.reputation, 8);
        for (const p of squad) insertPlayer(db, p, club.id);
        for (const p of youth) insertPlayer(db, p, club.id);
      }
    }

    db.prepare(`INSERT INTO meta (key, value) VALUES ('worldSeeded', '1')`).run();
    db.prepare(`INSERT INTO meta (key, value) VALUES ('currentSeason', ?)`)
      .run(String(new Date().getFullYear()));
  });

  seedTx();
}
