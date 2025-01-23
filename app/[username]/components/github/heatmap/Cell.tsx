import clsx from "clsx";

interface CellProps {
  contributionCount: number;
  date: string;
}

const Cell: React.FC<CellProps> = ({ contributionCount, date }) => {
  return (
    <div
      className={clsx(
        "w-[16px] h-[16px] 2xl:w-[18px] 2xl:h-[18px] rounded-md flex items-center justify-center mb-[2px]",
        contributionCount == 0 && "bg-neutral-600",
        (contributionCount == 1 || contributionCount == 2) && "bg-green-600",
        (contributionCount == 3 || contributionCount == 4) && "bg-green-500",
        (contributionCount == 5 || contributionCount == 6) && "bg-green-400",
        (contributionCount == 7 || contributionCount >= 8) && "bg-green-300"
      )}
    >
      <div
        className={clsx(
          "w-[12px] h-[12px] 2xl:w-[14px] 2xl:h-[14px] rounded-md",
          contributionCount == 0 && "bg-neutral-500",
          (contributionCount == 1 || contributionCount == 2) && "bg-green-700",
          (contributionCount == 3 || contributionCount == 4) && "bg-green-600",
          (contributionCount == 5 || contributionCount == 6) && "bg-green-500",
          (contributionCount == 7 || contributionCount >= 8) && "bg-green-400"
        )}
      ></div>
    </div>
  );
};

export default Cell;
