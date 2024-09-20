"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "@/public/white.png";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="container mx-auto px-6 sm:px-10 xl:px-12 mt-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="text-center lg:text-left w-full lg:w-1/2">
              <div className="flex items-center gap-4 mb-8">
                <Image src={Logo} alt="" height={70} width={70} />
                <h1 className="text-7xl font-extrabold">Devboard</h1>
              </div>
              <h2 className="text-3xl font-extrabold">
                The better <span className="text-indigo-500">portfolio</span>{" "}
                for Software Engineers.
              </h2>
              <p className="mt-4 text-neutral-300">
                Display your skills, experience, and activity in one
                customizable profile. Share your profile with recruiters to get
                your dream job quicker and connect with friends to see their
                activity.
              </p>
              <div className="w-full flex justify-center lg:justify-start">
                <button
                  onClick={() => router.push("/sign-up")}
                  className="flex items-center mt-6 px-6 py-3 rounded-2xl bg-indigo-500 hover:cursor-pointer hover:transition-all duration-300"
                >
                  <p className="font-medium mr-2">Create Your Profile</p>
                  <ArrowRight size={26} />
                </button>
              </div>
            </div>
            <div className="transition-all bg-indigo-500 hidden lg:block h-[350px] w-1/2 rounded-xl p-8 skew-y-6 hover:skew-y-0 ml-16">
              <div className="flex justify-center">
                <div className="flex flex-col mr-4">
                  <div className="bg-white rounded-full w-[150px] h-[150px]"></div>
                  <div className="bg-white rounded-xl w-full h-[20px] mt-2"></div>
                  <div className="flex mt-2">
                    <div className="bg-white rounded-xl w-[20px] h-[20px] mr-1"></div>
                    <div className="bg-white rounded-xl w-[20px] h-[20px] mr-1"></div>
                    <div className="bg-white rounded-xl w-[20px] h-[20px] "></div>
                  </div>
                </div>
                <div className="flex flex-col w-2/3">
                  <div className="bg-white h-[40px] rounded-xl"></div>
                  <div className="flex">
                    <div className="bg-white h-[100px] w-1/2 rounded-xl mt-2 mr-2"></div>
                    <div className="bg-white h-[100px] w-1/2 rounded-xl mt-2"></div>
                  </div>
                  <div className="bg-white h-[80px] rounded-xl mt-2"></div>
                  <div className="flex">
                    <div className="bg-white h-[60px] w-1/3 rounded-xl mt-2 mr-2"></div>
                    <div className="bg-white h-[60px] w-1/3 rounded-xl mt-2 mr-2"></div>
                    <div className="bg-white h-[60px] w-1/3 rounded-xl mt-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
