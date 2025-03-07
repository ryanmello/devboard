import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import db from "@/lib/db";
import { FullUser } from "@/types";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      universityId,
      startYear,
      graduationYear,
      major,
      minor,
      gpa,
    } = body;

    const { userId } = auth();
    const currentUser = (await getCurrentUser({ clerkId: userId })) as FullUser;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const education = await db.education.create({
      data: {
        userId: currentUser.id,
        universityId: parseInt(universityId),
        startYear,
        graduationYear,
        major,
        minor,
        gpa,
      },
    });

    return NextResponse.json(education);
  } catch (error: any) {
    console.log(error, "/api/education/create");
    return new NextResponse("Internal error", { status: 500 });
  }
}
