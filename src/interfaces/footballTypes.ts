export interface GoalScorer {
  player: string;
  goals: number;
  assists: number;
}

export interface MatchCard {
  player: string;
  type: "yellow" | "red";
  minute: number;
}

export interface CardType {
  player: string;
  card: "yellow" | "red";
  mins: string;
}

export interface MatchGoal {
  scorer: string;
  minute: number;
  assist?: string;
}

export interface Match {
  date: string;
  opposition: string;
  venue: string;
  scored: number;
  conceded: number;
  league?: string;
  video?: string;
  goals?: MatchGoal[];
  cards?: MatchCard[];
  notes?: string;
}

export interface Season {
  startDate: string;
  details: Match[];
}

export interface GoalStats {
  season: string;
  details: GoalScorer[];
}

export interface FootballSeasonProps {
  season?: string[];
  matches?: Season[];
  goals?: GoalStats[];
}
