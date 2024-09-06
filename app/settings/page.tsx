import { auth } from "@clerk/nextjs/server";
import getCurrentUser from "../actions/getCurrentUser";

const Settings = async () => {
  const { userId } = auth();
  const user = await getCurrentUser({ clerkId: userId });
  
  return (
    <div>
      <p>{user?.email}</p>
    </div>
  );
};

export default Settings;
