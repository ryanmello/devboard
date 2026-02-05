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
      projectId,
      name,
      gitHubUrl,
      primaryLanguage,
      description,
      image,
      url,
    } = body;

    const project = await db.project.update({
      where: {
        id: projectId,
        userId: currentUser.id,
      },
      data: {
        name,
        gitHubUrl,
        primaryLanguage,
        description,
        image,
        url,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.log("/api/project/update", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
