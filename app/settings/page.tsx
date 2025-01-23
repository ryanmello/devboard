import { auth } from "@clerk/nextjs/server";
import Settings from "./components/Settings";

const SettingsPage = () => {
  const { userId } = auth();

  return (
    <div>
      <Settings clerkId={userId} />
    </div>
  );
};

export default SettingsPage;
