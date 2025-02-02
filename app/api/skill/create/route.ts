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
    const { name, image } = body;

    if (!name || !image) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const skill = await db.skill.create({
      data: {
        name,
        image,
        userId,
      },
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.log("[SKILL_CREATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 