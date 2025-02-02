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
    const { skillId, name, image } = body;

    if (!skillId || !name || !image) {
      return new NextResponse("Missing required fields", { status: 400 });
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

    const updatedSkill = await db.skill.update({
      where: {
        id: skillId,
      },
      data: {
        name,
        image,
      },
    });

    return NextResponse.json(updatedSkill);
  } catch (error) {
    console.log("[SKILL_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 