import getCurrentUser from "@/app/actions/getCurrentUser";
import db from "@/lib/db";
import { FullUser } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId } = body;

    const { userId } = auth();
    const currentUser = (await getCurrentUser({ clerkId: userId })) as FullUser;

    if (currentUser == null) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const project = await db.project.delete({
      where: {
        id: projectId,
        userId: currentUser.id,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.log("/api/project/delete", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
