import { auth } from "@clerk/nextjs/server";
import Community from "./components/Community";

const CommunityPage = () => {
  const { userId } = auth();

  return <Community clerkId={userId} />;
};

export default CommunityPage;
