import db from "@/lib/db";

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
