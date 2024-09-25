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
      educationId,
      universityName,
      startYear,
      graduationYear,
      major,
      minor,
      gpa,
      image,
    } = body;

    const education = await db.education.update({
      where: {
        id: educationId,
        userId: currentUser.id,
      },
      data: {
        universityName,
        startYear,
        graduationYear,
        major,
        minor,
        gpa,
        image,
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.log("/api/education/update", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
