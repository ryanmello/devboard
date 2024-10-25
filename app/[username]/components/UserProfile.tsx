"use client";

import { useEffect, useState } from "react";
import LeftProfile from "./LeftProfile";
import RightProfile from "./RightProfile";
import { FullUser } from "@/types";
import axios from "axios";

const UserProfile = ({ username }: { username: string }) => {
  const [user, setUser] = useState<FullUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!username) {
          setLoading(false);
          return;
        }

        const response = await axios.post("/api/user/fetch/username", {
          username,
        });

        const user = response.data;
        setUser(user);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="flex pt-8 px-8 gap-8">
      <LeftProfile user={user} />
      <RightProfile user={user} />
    </div>
  );
};

export default UserProfile;
