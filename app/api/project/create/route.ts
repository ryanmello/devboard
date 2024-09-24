import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import db from "@/lib/db";
import { FullUser } from "@/types";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, gitHubUrl, primaryLanguage, description, image, url } = body;

    // validate link
    if (gitHubUrl != null && gitHubUrl != "") {
      const urlPattern =
        /^(https?:\/\/)?(www\.)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(\/[^\s]*)?$/;
      if (!urlPattern.test(gitHubUrl)) {
        return new NextResponse("Invalid Github link", { status: 401 });
      }

      if (!gitHubUrl.toLowerCase().includes("https://github.com/")) {
        return new NextResponse("Invalid Github link", { status: 401 });
      }
    }

    const { userId } = auth();
    const currentUser = (await getCurrentUser({ clerkId: userId })) as FullUser;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const project = await db.project.create({
      data: {
        userId: currentUser.id,
        name,
        gitHubUrl,
        primaryLanguage,
        description,
        image,
        url,
      },
    });

    return NextResponse.json(project);
  } catch (error: any) {
    console.log(error, "/api/project/create");
    return new NextResponse("Internal error", { status: 500 });
  }
}
