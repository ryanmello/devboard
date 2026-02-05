"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

const experienceTypes = [
  "Full-Time",
  "Part-Time",
  "Self-Employed",
  "Freelance",
  "Contract",
  "Internship",
  "Apprenticeship",
  "Seasonal"
] as const;

const formSchema = z.object({
  company: z.string().min(1).max(50),
  title: z.string().min(1).max(50),
  startMonth: z.string().min(1),
  startYear: z.string().min(1),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
  isCurrent: z.boolean().default(false),
  location: z.string().min(1).max(50),
  type: z.enum(experienceTypes, {
    required_error: "Please select an employment type",
  }),
  description: z.string().max(500).optional(),
});

const AddExperience = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      title: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      isCurrent: false,
      location: "",
      description: "",
    },
  });

  const isCurrent = form.watch("isCurrent");

  useEffect(() => {
    if (isCurrent) {
      form.setValue("endMonth", "");
      form.setValue("endYear", "");
    }
  }, [isCurrent, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    axios
      .post("/api/experience/create", values)
      .then(() => {
        toast.success("Experience added successfully");
        router.refresh();
        form.reset();
      })
      .catch(() => toast.error("Something went wrong"));
  };

  return (
    <div className="w-1/2">
      <h2 className="text-xl font-bold pb-2">Add Experience</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
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
              name="startMonth"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Start Month</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          </div>

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="endMonth"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>End Month</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      value={field.value || ""}
                      disabled={form.watch("isCurrent")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endYear"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>End Year</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      value={field.value || ""}
                      disabled={form.watch("isCurrent")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isCurrent"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Input 
                    type="checkbox" 
                    className="w-4 h-4"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Current Role</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {experienceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

          <Button type="submit" className="w-full" variant="secondary">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddExperience;
