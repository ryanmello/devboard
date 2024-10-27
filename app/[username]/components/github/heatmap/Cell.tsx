import clsx from "clsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CellProps {
  contributionCount: number;
  date: string;
}

const Cell: React.FC<CellProps> = ({ contributionCount, date }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={clsx(
              "mb-[2px] w-[14px] h-[14px] xl:w-[16px] xl:h-[16px] 2xl:w-[20px] 2xl:h-[20px] rounded-sm flex items-center justify-center",
              "transition-transform transform duration-200 ease-in-out hover:scale-110",
              contributionCount === 0 && "bg-neutral-700 hover:bg-neutral-600",
              contributionCount >= 1 &&
                contributionCount <= 2 &&
                "bg-green-600 hover:bg-green-500",
              contributionCount >= 3 &&
                contributionCount <= 4 &&
                "bg-green-500 hover:bg-green-400",
              contributionCount >= 5 &&
                contributionCount <= 6 &&
                "bg-green-400 hover:bg-green-300",
              contributionCount >= 7 && "bg-green-300 hover:bg-green-200"
            )}
          >
            <div
              className={clsx(
                "w-[12px] h-[12px] xl:w-[14px] xl:h-[14px] 2xl:w-[18px] 2xl:h-[18px] rounded-sm",
                "transition-colors duration-200 ease-in-out",
                contributionCount === 0 && "bg-neutral-600",
                contributionCount >= 1 &&
                  contributionCount <= 2 &&
                  "bg-green-700",
                contributionCount >= 3 &&
                  contributionCount <= 4 &&
                  "bg-green-600",
                contributionCount >= 5 &&
                  contributionCount <= 6 &&
                  "bg-green-500",
                contributionCount >= 7 && "bg-green-400"
              )}
            ></div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {contributionCount > 1 ? (
            <p>
              {contributionCount} contributions on {date}
            </p>
          ) : (
            <p>
              {contributionCount} contribution on {date}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Cell;
