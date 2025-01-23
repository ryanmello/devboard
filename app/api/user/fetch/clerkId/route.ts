import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { clerkId } = body;

    if (!clerkId) {
      return new NextResponse("Missing clerkId in request body", {
        status: 400,
      });
    }

    const user = await getCurrentUser({ clerkId: clerkId });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
