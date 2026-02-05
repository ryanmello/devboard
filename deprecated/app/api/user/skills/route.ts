import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const skills = body.skills;

    if (!Array.isArray(skills)) {
      return new NextResponse("Skills must be an array", { status: 400 });
    }

    // Update the user's skills
    const user = await db.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        skills: skills,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_SKILLS_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
