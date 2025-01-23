"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Heatmap from "./heatmap/Heatmap";

const GitHubHeatmap = ({
  gitHubUsername,
}: {
  gitHubUsername: string | null;
}) => {
  const [contributionData, setContributionData] =
    useState<Externals.Github.ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!gitHubUsername) {
          setLoading(false);
          return;
        }

        const response = await axios.post("/api/user/fetch/github", {
          gitHubUsername,
        });

        setContributionData(response.data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [gitHubUsername]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const {
    data: {
      user: {
        contributionsCollection: {
          contributionCalendar: { totalContributions = 0, weeks = [] } = {},
        } = {},
      } = {},
    } = {},
  } = contributionData || {};

  if (!contributionData || !totalContributions || !weeks) {
    throw new Error("Incomplete contribution data");
  }

  return (
    <div className="h-auto rounded-xl mb-4">
      <div className="flex justify-between">
        <h2 className="font-bold pb-2">GitHub Heatmap</h2>
        <h2 className="font-medium pb-2 mr-1">
          {totalContributions} contributions
        </h2>
      </div>
      <Heatmap weeks={weeks} />
    </div>
  );
};

export default GitHubHeatmap;
