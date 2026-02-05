import Cell from "./Cell";

interface WeekProps {
  contributionDays: Externals.Github.ContributionDay;
}

const Week: React.FC<WeekProps> = ({ contributionDays }) => {
  return (
    <div className="flex flex-row gap-1">
      <Cell
        contributionCount={contributionDays.contributionCount}
        date={contributionDays.date}
      />
    </div>
  );
};

export default Week;
