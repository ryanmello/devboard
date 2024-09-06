import db from "@/lib/db";
import { unstable_cache } from "next/cache";

const getCurrentUser = unstable_cache(
  async ({ clerkId }: { clerkId: string | null }) => {
    try {
      if (clerkId == null) return null;

      const currentUser = await db.user.findUnique({
        where: {
          clerkId: clerkId,
        },
        include: {
          projects: true,
          experience: true,
          education: true,
        },
      });

      if (!currentUser) {
        return null;
      }

      return currentUser;
    } catch (error: any) {
      return null;
    }
  },
  ["getCurrentUser"],
  {
    revalidate: 60,
  }
);

export default getCurrentUser;

// example to purge cache
// async function updateUserInfo(clerkId: string, updates: any) {
//   try {
//     // Update user information in the database
//     await db.user.update({
//       where: { clerkId },
//       data: updates,
//     });

//     // Purge the cache for the updated user
//     unstable_cache.invalidate(`getCurrentUser:${clerkId}`);

//     // Optionally, fetch and return the updated user data
//     return await getCurrentUser({ clerkId });
//   } catch (error) {
//     console.error("Error updating user info:", error);
//     throw new Error("Unable to update user information.");
//   }
// }
