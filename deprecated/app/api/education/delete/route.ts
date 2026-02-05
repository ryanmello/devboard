import getCurrentUser from "@/app/actions/getCurrentUser";
import db from "@/lib/db";
import { FullUser } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { educationId } = body;

    const { userId } = auth();
    const currentUser = (await getCurrentUser({ clerkId: userId })) as FullUser;

    if (currentUser == null) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const education = await db.education.delete({
      where: {
        id: educationId,
        userId: currentUser.id,
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.log("/api/education/delete", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
