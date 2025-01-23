import getUserByUsername from "@/app/actions/getUserByUsername";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { username } = body;

    if (!username) {
      return new NextResponse("Missing username in request body", {
        status: 400,
      });
    }

    const user = await getUserByUsername(username);

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
