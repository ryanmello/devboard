import getCurrentUser from "@/app/actions/getCurrentUser";
import db from "@/lib/db";
import { FullUser } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const currentUser = (await getCurrentUser({ clerkId: userId })) as FullUser;

    if (currentUser == null) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      experienceId,
      company,
      title,
      startMonth,
      startYear,
      endMonth,
      endYear,
      isCurrent,
      location,
      type,
      description,
      image,
    } = body;

    const experience = await db.experience.update({
      where: {
        id: experienceId,
        userId: currentUser.id,
      },
      data: {
        company,
        title,
        startMonth,
        startYear,
        endMonth,
        endYear,
        isCurrent,
        location,
        type,
        description,
        image,
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.log("/api/experience/update", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
