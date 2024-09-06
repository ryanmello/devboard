import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const requestData = await req.json();
    const {
      firstName,
      lastName,
      headline,
      image,
      resume,
      gitHubUsername,
      leetCodeUsername,
      linkedInUsername,
    } = requestData;

    const user = await db.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        firstName,
        lastName,
        headline,
        image,
        resume,
        gitHubUsername,
        leetCodeUsername,
        linkedInUsername,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("/api/user", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
