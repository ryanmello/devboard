"use client";

import Image from "next/image";
import { Trash } from "lucide-react";
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
import { useRouter } from "next/navigation";

const formSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  headline: z.string().min(2).max(50).optional(),
  gitHubUsername: z.string().min(2).max(50).optional(),
  leetCodeUsername: z.string().min(2).max(50).optional(),
  linkedInUsername: z.string().min(2).max(50).optional(),
});

const ProfileTab = ({ currentUser }: { currentUser: FullUser }) => {
  const [image, setImage] = useState(currentUser.image || undefined);
  const [displayImageUpload, setDisplayImageUpload] = useState(
    !currentUser.image
  );
  const [resume, setResume] = useState(currentUser.resume || undefined);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: currentUser.firstName || undefined,
      lastName: currentUser.lastName || undefined,
      headline: currentUser.headline || undefined,
      gitHubUsername: currentUser.gitHubUsername || undefined,
      leetCodeUsername: currentUser.leetCodeUsername || undefined,
      linkedInUsername: currentUser.linkedInUsername || undefined,
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
        image,
        resume,
        gitHubUsername,
        leetCodeUsername,
        linkedInUsername,
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.success("Something went wrong.");
    }
  };

  return (
    <div className="flex justify-center px-8 gap-8">
      <div className="w-[300px]">
        <h2 className="text-xl font-bold my-4">Edit Profile</h2>
        {image && !displayImageUpload ? (
          <Image
            src={image}
            alt="image"
            width={300}
            height={300}
            className="rounded-3xl border w-[300px] h-[300px] object-cover cursor-pointer"
            onClick={() => setDisplayImageUpload(true)}
          />
        ) : (
          <>
            <div className="absolute flex items-center justify-center w-[300px] h-[300px] bg-primary-foreground rounded-3xl border cursor-pointer"></div>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                setImage(res[0].url);
                setDisplayImageUpload(false);
                toast.success("Upload Completed");
              }}
              onUploadError={(error: Error) => {
                toast.error(`ERROR! ${error.message}`);
              }}
              className="h-[300px] relative border rounded-3xl"
            />
          </>
        )}
        <p className="relative text-2xl font-semibold mt-4">Ryan Mello</p>
        <p className="relative text-lg font-semibold">
          @{currentUser.username}
        </p>
      </div>
      <div className="w-[500px] mt-10">
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
                endpoint="resume"
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
            <Button
              disabled={
                !form.formState.isDirty &&
                image == currentUser.image &&
                resume == currentUser.resume
              }
              className="w-full"
              variant="secondary"
              type="submit"
            >
              Save Changes
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileTab;
