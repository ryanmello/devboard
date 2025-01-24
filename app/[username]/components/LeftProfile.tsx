"use client";

import { FullUser } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import alt from "@/public/alt.jpg";
import { Button } from "@/components/ui/button";
import { BsLinkedin } from "react-icons/bs";
import { SiLeetcode } from "react-icons/si";
import { BsGithub } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";

const LeftProfile = ({ user }: { user: FullUser }) => {
  const router = useRouter();

  return (
    <div className="w-1/4 2xl:w-1/5">
      {user && (
        <div className="flex flex-col">
          <div className="w-full aspect-square relative">
            <Image
              alt="Profile Image"
              src={user.image || alt}
              width={400}
              height={400}
              className="rounded-3xl overflow-hidden h-full object-cover"
            />
          </div>
          <div>
            <p className="text-2xl font-semibold pt-4">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xl font-light text-zinc-300">{user.username}</p>
            <p className="my-4 leading-6 text-zinc-300">{user.headline}</p>

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
            <div className="flex flex-wrap mt-4 text-zinc-300">
              {user.linkedInUsername && (
                <a
                  href={`https://www.linkedin.com/in/${user.linkedInUsername}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 cursor-pointer mr-3"
                >
                  <BsLinkedin size={14} />
                  <p className="hover:underline">{user.linkedInUsername}</p>
                </a>
              )}
              {user.gitHubUsername && (
                <a
                  href={`https://github.com/${user.gitHubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 cursor-pointer mr-3"
                >
                  <BsGithub size={14} />
                  <p className="hover:underline">{user.linkedInUsername}</p>
                </a>
              )}
              {user.leetCodeUsername && (
                <a
                  href={`https://leetcode.com/u/${user.leetCodeUsername}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 cursor-pointer mr-3"
                >
                  <SiLeetcode size={14} />
                  <p className="hover:underline">{user.linkedInUsername}</p>
                </a>
              )}

              {/* TODO:
              Add resume
              Add intrests */}
            </div>
          </div>

          <h2 className="mt-4 mb-1 text-sm font-medium text-zinc-300">Interests</h2>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary">Machine Learning</Badge>
            <Badge variant="secondary">Artificial Intelligence</Badge>
            <Badge variant="secondary">Web Development</Badge>
            <Badge variant="secondary">System Design</Badge>
            <Badge variant="secondary">Cloud Engineering</Badge>
            <Badge variant="secondary">Robotics</Badge>
            <Badge variant="secondary">Math</Badge>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftProfile;
