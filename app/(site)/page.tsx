import { Button } from "@/components/ui/button";
import { SignOutButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      Hello World
      <Button>HI!</Button>
      <UserButton />
    </div>
  );
}
