import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const requestData = await req.json();
    const { firstName, lastName, headline, resume } = requestData;

    const user = await db.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        firstName,
        lastName,
        headline,
        resume,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
