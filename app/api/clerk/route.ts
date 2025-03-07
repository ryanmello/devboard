import db from "@/lib/db";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // if there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType == "user.created" || eventType == "user.updated") {
    const { id, email_addresses, first_name, last_name, username } = evt.data;

    if (!username) {
      return new Response("Username is required", {
        status: 400,
      });
    }

    // check if username is a reserved route
    if (BANNED_USERNAMES.includes(username.toLowerCase())) {
      return new Response("Username is not allowed", {
        status: 400,
      });
    }

    // check if user exists
    const existingUser = await db.user.findUnique({
      where: { clerkId: id as string },
    });

    if (existingUser) {
      // update user
      await db.user.update({
        where: { clerkId: id as string },
        data: {
          firstName: first_name,
          lastName: last_name,
          email: email_addresses[0].email_address,
          username: username,
          updatedAt: new Date(),
        },
      });
    } else {
      // create user
      await db.user.create({
        data: {
          clerkId: id as string,
          email: email_addresses[0].email_address,
          username: username,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  if (eventType == "user.deleted") {
    const { id } = evt.data;
    await db.user.delete({
      where: {
        clerkId: id,
      },
    });
  }

  return new Response("", { status: 200 });
}

const BANNED_USERNAMES = [
  "settings",
  "api",
  "auth",
  "sign-up",
  "sign-in",
  "dashboard",
  "profile",
  "admin",
  "projects",
  "experience",
  "education",
  "skills",
  "about",
  "contact",
  "community",
  "terms",
  "privacy",
  "help",
  "support",
  "blog",
  "docs",
];
