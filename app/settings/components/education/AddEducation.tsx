"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  universityName: z.string().min(2).max(50),
  startYear: z.string().min(2).max(4),
  graduationYear: z.string().min(2).max(4),
  major: z.string().min(2).max(50),
  gpa: z.string().max(3).optional(),
  clubName: z.string().max(50).optional(),
  clubPosition: z.string().max(50).optional(),
  clubImpact: z.string().max(50).optional(),
});

const AddEducation = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      universityName: "",
      startYear: "",
      graduationYear: "",
      major: "",
      gpa: "",
      clubName: "",
      clubPosition: "",
      clubImpact: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    axios
      .post("/api/education/create", values)
      .then(() => {
        toast.success("Success");
        router.refresh();
        form.reset();
      })
      .catch(() => toast.error("Something went wrong"))
  };

  return (
    <div className="w-1/2">
      <h2 className="text-xl font-bold pb-2">Add Education</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="universityName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="startYear"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Start Year</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="graduationYear"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Graduation Year</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="major"
              render={({ field }) => (
                <FormItem className="w-3/4">
                  <FormLabel>Major</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gpa"
              render={({ field }) => (
                <FormItem className="w-1/4">
                  <FormLabel>GPA</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="clubName"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Club Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clubPosition"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Club Position</FormLabel>
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
            name="clubImpact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Club Impact</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" variant="secondary">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddEducation;
