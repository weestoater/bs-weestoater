import { MatchGoal, GoalScorer } from "../interfaces/footballTypes";

export const calculateMatchResult = (
  scored: number,
  conceded: number,
): "W" | "D" | "L" => {
  if (scored > conceded) return "W";
  if (scored < conceded) return "L";
  return "D";
};

export const formatScore = (
  scored: number,
  conceded: number,
  venue: string,
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

/**
 * Calculate top scorers (goals + assists) from raw match data.
 * This is the single source of truth — derived directly from
 * football_match_goals so it always reflects the latest data.
 */
export const calculateTopScorers = (
  matches: import("../interfaces/footballTypes").Match[],
): GoalScorer[] => {
  const statsMap = new Map<string, { goals: number; assists: number }>();

  for (const match of matches) {
    if (!match.goals) continue;
    for (const goal of match.goals) {
      // Credit goal to scorer
      if (!statsMap.has(goal.player)) {
        statsMap.set(goal.player, { goals: 0, assists: 0 });
      }
      statsMap.get(goal.player)!.goals += 1;

      // Credit assist to provider
      if (goal.assist) {
        if (!statsMap.has(goal.assist)) {
          statsMap.set(goal.assist, { goals: 0, assists: 0 });
        }
        statsMap.get(goal.assist)!.assists += 1;
      }
    }
  }

  return Array.from(statsMap.entries())
    .map(([player, { goals, assists }]) => ({ player, goals, assists }))
    .sort((a, b) => a.player.localeCompare(b.player));
};
