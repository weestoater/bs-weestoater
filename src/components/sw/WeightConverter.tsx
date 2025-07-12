export const WeightConverter = (props: any) => {
  const { lbs, kgs } = props;
  // Convert kgs to lbs if only kgs is provided
  const weightInLbs = kgs ? kgs * 2.20462 : lbs;

  // Guard: If no valid input, return null or a message
  if (!weightInLbs || isNaN(weightInLbs)) {
    return <span>Invalid weight</span>;
  }

  // Calculate stones and remaining lbs
  const stones = Math.floor(weightInLbs / 14);
  const remainingLbs = (weightInLbs % 14).toFixed(1);
  const weightInKgs = (weightInLbs * 0.45359237).toFixed(2);
  const roundedLbs = weightInLbs.toFixed(1);

  // Format output string
  const result = `${stones} st ${remainingLbs} lbs (${roundedLbs} lbs) | ${weightInKgs} kgs`;

  return <span>{result}</span>;
};
