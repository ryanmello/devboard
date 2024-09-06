"use client";

import Image from "next/image";
import { CameraOff, Trash } from "lucide-react";
import { FullUser } from "@/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";

const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  headline: z.string().min(2).max(50),
  gitHubUsername: z.string().min(2).max(50),
  leetCodeUsername: z.string().min(2).max(50),
  linkedInUsername: z.string().min(2).max(50),
});

const Settings = ({ currentUser }: { currentUser: FullUser }) => {
  const [image, setImage] = useState(currentUser.image);
  const [resume, setResume] = useState(currentUser.resume);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: currentUser.firstName || "",
      lastName: currentUser.lastName || "",
      headline: currentUser.headline || "",
      gitHubUsername: currentUser.gitHubUsername || "",
      leetCodeUsername: currentUser.leetCodeUsername || "",
      linkedInUsername: currentUser.linkedInUsername || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      toast.success("Profile updated!");
      const {
        firstName,
        lastName,
        headline,
        gitHubUsername,
        leetCodeUsername,
        linkedInUsername,
      } = values;
      await axios.post("/api/user", {
        firstName,
        lastName,
        headline,
        resume,
        gitHubUsername,
        leetCodeUsername,
        linkedInUsername,
      });
    } catch (error) {
      console.log(error);
      toast.success("Something went wrong.");
    }
  };

  return (
    <>
      <div className="flex justify-center px-8 gap-8 mt-4">
        <div className="w-1/5">
          <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
          {currentUser.image ? (
            <Image
              src={currentUser.image}
              alt="image"
              width={100}
              height={100}
            />
          ) : (
            <div className="flex items-center justify-center w-[300px] h-[300px] bg-primary-foreground rounded-3xl border cursor-pointer">
              <CameraOff size={40} />
            </div>
          )}
          <p className="text-3xl font-semibold mt-4">Ryan Mello</p>
          <p className="text-lg font-semibold">@{currentUser.username}</p>
        </div>
        <div className="w-1/3 mt-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Resume</FormLabel>
                <UploadDropzone
                  endpoint="imageUploader"
                  appearance={{
                    button: "text-sm",
                    container: "w-full flex-row rounded-md p-4",
                  }}
                  // onUploadBegin={() => setIsLoading(true)}
                  onClientUploadComplete={(res) => {
                    setResume(res[0].url);
                    toast.success("Upload Completed");
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`ERROR! ${error.message}`);
                  }}
                  className="cursor-pointer mt-0"
                />
                {resume && (
                  <div className="flex justify-between items-center border w-full p-4 rounded-xl mt-2">
                    <a
                      className="text-sm hover:underline truncate mr-8"
                      href={resume}
                      target="_blank"
                    >
                      {resume}
                    </a>
                    <div className="flex items-center space-x-2">
                      <Trash size={18} className="cursor-pointer" />
                    </div>
                  </div>
                )}
              </div>
              <FormField
                control={form.control}
                name="gitHubUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leetCodeUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LeetCode Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedInUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" variant="secondary" type="submit">
                Save Changes
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Settings;
