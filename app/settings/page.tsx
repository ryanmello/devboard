import { auth } from "@clerk/nextjs/server";
import getCurrentUser from "../actions/getCurrentUser";
import Settings from "./components/Settings";

const Index = async () => {
  const { userId } = auth();
  const currentUser = await getCurrentUser({ clerkId: userId });

  if (!currentUser) return null;

  return <Settings currentUser={currentUser} />;
};

export default Index;
