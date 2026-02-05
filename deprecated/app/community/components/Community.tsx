"use client";

import { useEffect, useState } from "react";
import { FullUser } from "@/types";
import axios from "axios";

const Community = ({ clerkId }: { clerkId: string | null }) => {
  const [currentUser, setCurrentUser] = useState<FullUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!clerkId) {
          setLoading(false);
          return;
        }

        const response = await axios.post("/api/user/fetch/clerkId", { clerkId });

        const user = response.data;
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [clerkId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>Community</p>
      {currentUser && <p>Welcome, {currentUser.username}!</p>}
    </div>
  );
};

export default Community;
