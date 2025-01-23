import Cell from "./Cell";

interface WeekProps {
  contributionDays: Externals.Github.ContributionDay;
}

const Week: React.FC<WeekProps> = ({ contributionDays }) => {
  return (
    <Cell
      contributionCount={contributionDays.contributionCount}
      date={contributionDays.date}
    />
  );
};

export default Week;
