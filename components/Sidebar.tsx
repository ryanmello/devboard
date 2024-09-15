import { auth } from "@clerk/nextjs/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import SidebarContent from "./SidebarContent";

const Sidebar = async () => {
  const { userId } = auth();
  const currentUser = await getCurrentUser({ clerkId: userId });

  return <SidebarContent currentUser={currentUser} />;
};

export default Sidebar;
