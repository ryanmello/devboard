import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import db from "@/lib/db";
import { FullUser } from "@/types";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
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

    const { userId } = auth();
    const currentUser = (await getCurrentUser({ clerkId: userId })) as FullUser;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const experience = await db.experience.create({
      data: {
        userId: currentUser.id,
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
  } catch (error: any) {
    console.log(error, "/api/experience/create");
    return new NextResponse("Internal error", { status: 500 });
  }
}
