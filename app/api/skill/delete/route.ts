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
    const { skillId } = body;

    if (!skillId) {
      return new NextResponse("Skill ID is required", { status: 400 });
    }

    // Verify the skill belongs to the user
    const existingSkill = await db.skill.findUnique({
      where: {
        id: skillId,
        userId,
      },
    });

    if (!existingSkill) {
      return new NextResponse("Unauthorized or skill not found", { status: 404 });
    }

    await db.skill.delete({
      where: {
        id: skillId,
      },
    });

    return NextResponse.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.log("[SKILL_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 