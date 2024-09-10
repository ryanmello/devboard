import db from "@/lib/db";

const getUserByUsername = async (username: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        username: username,
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

export default getUserByUsername;
