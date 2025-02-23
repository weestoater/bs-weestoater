export interface GoalScorersDetails {
  player: string;
  goals: number;
}

export interface Goals {
  player: string;
  mins: string;
}

export interface Card {
  card: string;
  player: string;
  mins: string;
}

export interface ScoreDetails {
    scored: number;
    conceded: number;
    venue: string;
}

export interface MatchDetails {
    date: string;
    venue: string;
    league: string;
    opposition: string;
    conceded: number;
    scored: number;
    video: string;
    goals: any;
    cards: any;
    notes: string;
}