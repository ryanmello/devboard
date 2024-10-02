"use client"

import useProgrammingLanguages from "@/hooks/useProgrammingLanguages";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Trash } from "lucide-react";
import { FullUser } from "@/types";
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
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";

const formSchema = z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    headline: z.string().min(2).max(50),
    gitHubUsername: z.string().min(2).max(50),
    leetCodeUsername: z.string().min(2).max(50),
    linkedInUsername: z.string().min(2).max(50),
  });

const NewProject = ({totalProjects}: {totalProjects: number}) => {
    const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const programmingLanguages = useProgrammingLanguages();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       firstName: currentUser.firstName || "",
//       lastName: currentUser.lastName || "",
//       headline: currentUser.headline || "",
//       gitHubUsername: currentUser.gitHubUsername || "",
//       leetCodeUsername: currentUser.leetCodeUsername || "",
//       linkedInUsername: currentUser.linkedInUsername || "",
//     },
//   });
  
  return (
    <div>
      
    </div>
  )
}

export default NewProject
