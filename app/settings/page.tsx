import { auth } from "@clerk/nextjs/server";
import getCurrentUser from "../actions/getCurrentUser";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { CameraOff } from "lucide-react";
import EditProfileForm from "./components/EditProfileForm";

const Settings = async () => {
  const { userId } = auth();
  const user = await getCurrentUser({ clerkId: userId });

  if (!user) return null;

  return (
    <>
      {/* <h2 className="text-2xl font-bold mb-4">Settings</h2> */}
      <div className="flex justify-center px-8 gap-8 mt-4">
        <div className="w-1/5">
          {user.image ? (
            <Image src={user.image} alt="image" width={100} height={100} />
          ) : (
            <div className="flex items-center justify-center w-[300px] h-[300px] bg-primary-foreground rounded-3xl border">
              <CameraOff size={40} />
            </div>
          )}
          <p className="text-3xl font-semibold mt-4">Ryan Mello</p>
          <p className="text-lg font-semibold">@{user.username}</p>
        </div>
        <div className="w-1/3">
          <EditProfileForm />
        </div>
        {/* <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />
      </main> */}
      </div>
    </>
  );
};

export default Settings;
