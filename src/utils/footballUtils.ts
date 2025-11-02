import { MatchGoal, GoalScorer } from "../interfaces/footballTypes";

export const calculateMatchResult = (
  scored: number,
  conceded: number
): "W" | "D" | "L" => {
  if (scored > conceded) return "W";
  if (scored < conceded) return "L";
  return "D";
};

export const formatScore = (
  scored: number,
  conceded: number,
  venue: string
): string => {
  return venue.toLowerCase() === "home"
    ? `${scored} - ${conceded}`
    : `${conceded} - ${scored}`;
};

export const sortGoalScorers = (scorers: GoalScorer[]): GoalScorer[] => {
  return [...scorers].sort((a, b) => {
    const aGoals = a.goals ?? 0;
    const bGoals = b.goals ?? 0;
    const aAssists = a.assists ?? 0;
    const bAssists = b.assists ?? 0;

    if (aGoals !== bGoals) return bGoals - aGoals;
    if (aAssists !== bAssists) return bAssists - aAssists;
    return a.player.localeCompare(b.player);
  });
};

export const getGoalMinutes = (goals: MatchGoal[]): string => {
  return goals
    .map((goal) => goal.mins.toString())
    .sort((a, b) => parseInt(a) - parseInt(b))
    .join(", ");
};
