import { auth } from "@clerk/nextjs/server";
import Settings from "./components/Settings";

const SettingsPage = () => {
  const { userId } = auth();

  return <Settings clerkId={userId} />;
};

export default SettingsPage;
