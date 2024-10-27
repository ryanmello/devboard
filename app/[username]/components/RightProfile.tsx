"use client";

import { FullUser } from "@/types";
import GitHubHeatmap from "./github/GitHubHeatmap";

const RightProfile = ({ user }: { user: FullUser }) => {
  return (
    <div className="w-3/4 2xl:w-4/5">
      {/* LEETCODE STATS */}

      {/* GITHUB STATS */}
      <GitHubHeatmap gitHubUsername={user.gitHubUsername} />
    </div>
  );
};

export default RightProfile;
