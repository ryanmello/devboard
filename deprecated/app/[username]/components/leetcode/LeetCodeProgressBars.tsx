import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { LeetCodeStatsResponse } from "@/types";

const BorderLinearProgressEasy = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 10,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 600 : 200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 10,
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(1,184,166,255)"
        : "rgba(1,184,166,255)",
  },
}));

const BorderLinearProgressMedium = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 10,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 600 : 200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 10,
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(254,186,15,255)"
        : "rgba(254,186,15,255)",
  },
}));

const BorderLinearProgressHard = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 10,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 600 : 200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 10,
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(240,72,69,255)"
        : "rgba(240,72,69,255)",
  },
}));

interface LeetCodeProgressBarsProps {
  leetCodeData: LeetCodeStatsResponse;
}

const LeetCodeProgressBar = ({ leetCodeData }: LeetCodeProgressBarsProps) => {
  var easy = (Number(leetCodeData.easySolved) / Number(leetCodeData.totalSolved)) * 100;
  var medium = (Number(leetCodeData.mediumSolved) / Number(leetCodeData.totalSolved)) * 100;
  var hard = (Number(leetCodeData.hardSolved) / Number(leetCodeData.totalSolved)) * 100;

  return (
    <Box sx={{ flexGrow: 2 }}>
      <div className="flex items-center justify-between">
        <p className="font-semibold">Easy</p>
        <p className="font-semibold text-sm">
          {leetCodeData.easySolved}
        </p>
      </div>
      <BorderLinearProgressEasy variant="determinate" value={easy} />
      <br />
      <div className="flex items-center justify-between">
        <p className="font-semibold">Medium</p>
        <p className="font-semibold text-sm">
          {leetCodeData.mediumSolved}
        </p>
      </div>
      <BorderLinearProgressMedium variant="determinate" value={medium} />
      <br />
      <div className="flex items-center justify-between">
        <p className="font-semibold">Hard</p>
        <p className="font-semibold text-sm">
          {leetCodeData.hardSolved}
        </p>
      </div>
      <BorderLinearProgressHard variant="determinate" value={hard} />
    </Box>
  );
};

export default LeetCodeProgressBar;
