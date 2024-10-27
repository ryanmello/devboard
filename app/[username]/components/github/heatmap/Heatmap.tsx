import Week from "./Week";

interface HeatmapProps {
  weeks: Externals.Github.ContributionWeeks[];
}

const Heatmap: React.FC<HeatmapProps> = ({ weeks }) => {
  const contributionDays = weeks.reduce((prev, cur) => {
    return prev.concat(cur.contributionDays);
  }, [] as Externals.Github.ContributionDay[]);

  return (
    <div className="max-h-[120px] xl:max-h-[140px] 2xl:max-h-[160px] flex flex-col flex-wrap overflow-x-clip">
      {contributionDays.map((contributionDays, index) => (
        <Week key={index} contributionDays={contributionDays} />
      ))}
    </div>
  );
};

export default Heatmap;
