"use client";

import { Education } from "@prisma/client";
import { useForm } from "react-hook-form";
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
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

const formSchema = z.object({
  universityName: z.string().min(2).max(50),
  startYear: z.string().min(2).max(4),
  graduationYear: z.string().min(2).max(4),
  major: z.string().min(2).max(50),
  gpa: z.string().max(4).optional(),
  minor: z.string().max(50).optional(),
});

interface EditEducationFormProps {
  education: Education;
  onSuccess: () => void;
}

const EditEducationForm = ({ education, onSuccess }: EditEducationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      universityName: education.universityName,
      startYear: education.startYear,
      graduationYear: education.graduationYear,
      major: education.major,
      gpa: education.gpa || "",
      minor: education.minor || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/education/update`, {
        ...values,
        educationId: education.id,
      });
      toast.success("Education updated successfully");
      onSuccess();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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

        <FormField
          control={form.control}
          name="minor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minor (Optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default EditEducationForm;
