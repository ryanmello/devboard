"use client";

import { LeetCodeStatsResponse } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2"; // might be throwing vulnerability
import LeetCodeProgressBars from "./LeetCodeProgressBars";
import LeetCodeActivity from "./LeetCodeActivity";
import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(ArcElement, Tooltip, Legend);

const LeetCode = ({
  leetCodeUsername,
}: {
  leetCodeUsername: string | null;
}) => {
  const [leetCodeData, setLeetCodeData] =
    useState<LeetCodeStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!leetCodeUsername) {
          setLoading(false);
          return;
        }

        const response = await axios.post("/api/user/fetch/leetcode", {
          leetCodeUsername,
        });

        setLeetCodeData(response.data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [leetCodeUsername]);

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row mb-4 gap-4">
        <Skeleton className="h-[260px] 2xl:h-[300px] w-full md:w-1/2" />
        <Skeleton className="h-[260px] 2xl:h-[300px] w-full md:w-1/2" />
      </div>
    );
  }

  if (!leetCodeData) return null;

  const data = {
    datasets: [
      {
        data: [
          leetCodeData.easySolved,
          leetCodeData.mediumSolved,
          leetCodeData.hardSolved,
        ],
        backgroundColor: [
          "rgba(1,184,166,255)",
          "rgba(254,186,15,255)",
          "rgba(240,72,69,255)",
        ],
        borderColor: [
          "rgba(1,184,166,255)",
          "rgba(254,186,15,255)",
          "rgba(240,72,69,255)",
        ],
      },
    ],
  };
  const options = {
    events: [],
  };

  return (
    <div className="flex flex-col md:flex-row mb-4">
      <div className="h-[260px] 2xl:h-[300px] w-full md:w-1/2 rounded-xl p-4 bg-secondary/80">
        <h2 className="font-bold">LeetCode Stats</h2>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center max-h-[180px] 2xl:max-h-[220px] w-1/2 pb-2 mr-4">
            <Doughnut data={data} options={options} />
            <p className="font-bold pt-2">{leetCodeData.totalSolved} solved</p>
          </div>
          <div className="flex flex-col w-1/2">
            <LeetCodeProgressBars leetCodeData={leetCodeData} />
          </div>
        </div>
      </div>
      <LeetCodeActivity submissionCalendar={leetCodeData.submissionCalendar} />
    </div>
  );
};

export default LeetCode;
