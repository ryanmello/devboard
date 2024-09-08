import db from "@/lib/db";
import { unstable_cache } from "next/cache";

const getCurrentUser = async ({ clerkId }: { clerkId: string | null }) => {
  try {
    if (clerkId == null) return null;

    const user = await db.user.findUnique({
      where: {
        clerkId: clerkId,
      },
      include: {
        projects: true,
        experience: true,
        education: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error: any) {
    return null;
  }
};

export default getCurrentUser;

// const getCurrentUser = unstable_cache(
//   async ({ clerkId }: { clerkId: string | null }) => {
//     try {
//       if (clerkId == null) return null;

//       const currentUser = await db.user.findUnique({
//         where: {
//           clerkId: clerkId,
//         },
//         include: {
//           projects: true,
//           experience: true,
//           education: true,
//         },
//       });

//       if (!currentUser) {
//         return null;
//       }

//       return currentUser;
//     } catch (error: any) {
//       return null;
//     }
//   },
//   ["getCurrentUser"],
//   {
//     revalidate: 60,
//   }
// );

// export default getCurrentUser;
