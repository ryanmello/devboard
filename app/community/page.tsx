import { auth } from "@clerk/nextjs/server";
import Community from "./components/Community";

const Page = () => {
  const { userId } = auth();

  return (
    <div>
      <Community clerkId={userId} />
    </div>
  );
};

export default Page;
