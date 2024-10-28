import { getLeetCodeStats } from "@/app/actions/getLeetCodeStats";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { leetCodeUsername } = body;

    if (!leetCodeUsername) {
      return new NextResponse("Missing leetCodeUsername in request body", {
        status: 400,
      });
    }

    const data = await getLeetCodeStats(leetCodeUsername);

    if (!data) {
      return new NextResponse("Data not found", { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
