import db from "@/lib/db";

const getCurrentUser = async ({ clerkId }: { clerkId: string | null }) => {
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
};

export default getCurrentUser;
