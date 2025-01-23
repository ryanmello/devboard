import { getGitHubContributionData } from "@/app/actions/getGitHubContributionData";
import getUserByUsername from "@/app/actions/getUserByUsername";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { gitHubUsername } = body;

    if (!gitHubUsername) {
      return new NextResponse("Missing gitHubUsername in request body", {
        status: 400,
      });
    }

    const data = await getGitHubContributionData(gitHubUsername);

    if (!data) {
      return new NextResponse("Data not found", { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};