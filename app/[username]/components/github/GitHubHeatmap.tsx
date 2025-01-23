"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const GitHubHeatmap = ({
  gitHubUsername,
}: {
  gitHubUsername: string | null;
}) => {
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
      <p>{gitHubData?.data.user.contributionsCollection.contributionCalendar.totalContributions}</p>
    </div>
  );
};

export default GitHubHeatmap;
