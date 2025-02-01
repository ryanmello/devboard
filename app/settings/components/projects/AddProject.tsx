"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
// import { UploadButton } from "@/utils/uploadthing";

const formSchema = z.object({
  name: z.string().min(1).max(50),
  gitHubUrl: z.string().url(),
  primaryLanguage: z.string().min(1),
  description: z.string().min(1).max(500).nullable(),
  url: z.string().url().nullable(),
});

const AddProject = () => {
  const router = useRouter();
  // const [image, setImage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gitHubUrl: "",
      primaryLanguage: "",
      description: null,
      url: null,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    axios
      .post("/api/project/create", {
        ...values,
        // image,
      })
      .then(() => {
        toast.success("Success");
        router.refresh();
        form.reset();
        // setImage(null);
      })
      .catch(() => toast.error("Something went wrong"));
  };

  return (
    <div className="w-1/2">
      <h2 className="text-xl font-bold pb-2">Add Project</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primaryLanguage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Language</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gitHubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <div className="space-y-2">
            <FormLabel>Project Image</FormLabel>
            {image ? (
              <div className="relative w-full h-48">
                <img
                  src={image}
                  alt="Project preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setImage(null)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setImage(res?.[0]?.url);
                  toast.success("Image uploaded!");
                }}
                onUploadError={(error: Error) => {
                  toast.error("Error uploading image");
                }}
              />
            )}
          </div> */}

          <Button type="submit" className="w-full" variant="secondary">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddProject;
