"use client";

import { useEffect, useState } from "react";
import { FullUser } from "@/types";

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

        const response = await fetch(`/api/user/fetch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clerkId }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const user = await response.json();
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
