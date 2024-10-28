"use client";

import { LeetCodeStatsResponse } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>{leetCodeData?.easySolved}</p>
    </div>
  );
};

export default LeetCode;
