"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const GitHubHeatmap = ({
  gitHubUsername,
}: {
  gitHubUsername: string | null;
}) => {
  try {
    const [gitHubData, setGitHubData] =
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

          setGitHubData(response.data);
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

    return (
      <div>
        <p>GITHUB</p>
        <p>
          {
            gitHubData?.data.user.contributionsCollection.contributionCalendar
              .totalContributions
          }
        </p>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch GitHub contributions data:", error);
    return (
      <div className="bg-neutral-700 h-auto rounded-xl mb-4 p-4">
        <h2 className="font-bold pb-2 text-neutral-300">GitHub Heatmap</h2>
        <p className="text-neutral-300">Unable to load contribution data.</p>
      </div>
    );
  }
};

export default GitHubHeatmap;
