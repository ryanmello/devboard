"use client";

import { FullUser } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Alt from "@/public/whitebg.jpg";
import { Code, FileCode, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BsLinkedin } from "react-icons/bs";
import { SiLeetcode } from "react-icons/si";
import { BsGithub } from "react-icons/bs";
import { IoDocumentTextOutline } from "react-icons/io5";

const Profile = ({ user }: { user: FullUser | null }) => {
  const router = useRouter();

  if (!user) {
    router.push("/sign-in");
  }

  return (
    <div className="flex pt-8 px-12">
      <div className="w-1/5">
        {user && (
          <div className="flex flex-col">
            <div className="w-full aspect-square relative">
              <Image
                alt="Profile Image"
                src={user?.image || Alt}
                width={400}
                height={400}
                className="rounded-3xl overflow-hidden h-full object-cover"
              />
            </div>
            <div>
              <p className="text-3xl font-semibold pt-4">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xl font-light">@{user.username}</p>
              <p className="my-4 text-md leading-6">{user.headline}</p>

              {/* Edit Profile */}
              <div className="flex">
                <Button
                  onClick={() => router.push("/settings")}
                  variant="secondary"
                  className="w-full"
                >
                  Edit Profile
                </Button>
              </div>

              {/* Connected Accounts -- LinkedIn, GitHub, LeetCode */}
              <div className="flex mt-4">
                {user.linkedInUsername && (
                  <a
                    href={`https://www.linkedin.com/in/${user.linkedInUsername}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BsLinkedin
                      size={30}
                      className="cursor-pointer mr-[10px]"
                    />
                  </a>
                )}
                {user.gitHubUsername && (
                  <a
                    href={`https://github.com/${user.gitHubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BsGithub size={30} className="cursor-pointer mr-2" />
                  </a>
                )}
                {user.leetCodeUsername && (
                  <a
                    href={`https://leetcode.com/${user.leetCodeUsername}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiLeetcode size={30} className="cursor-pointer mr-1" />
                  </a>
                )}
                {user.resume && (
                  <a
                    href={user.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IoDocumentTextOutline
                      size={30}
                      className="cursor-pointer"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-4/5">HEY</div>
    </div>
  );
};

export default Profile;
