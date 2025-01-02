import getCurrentUser from "@/app/actions/getCurrentUser";
import { auth } from "@clerk/nextjs/server";
import { AppSidebar } from "./app-sidebar";

const Sidebar2 = async () => {
  const { userId } = auth();
  const currentUser = await getCurrentUser({ clerkId: userId });

  return (
    <div>
      <AppSidebar currentUser={currentUser} />
    </div>
  );
};

export default Sidebar2;
