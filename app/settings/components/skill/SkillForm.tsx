"use client";

import { Button } from "@/components/ui/button";
import { FullUser } from "@/types";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";
import Other from "./Other";
import Backend from "./Backend";
import Frontend from "./Frontend";
import Core from "./Core";
import SkillPreview from "./SkillPreview";

const SkillForm = ({ currentUser }: { currentUser: FullUser }) => {
  const [skills, setSkills] = useState<string[]>(currentUser.skills);

  const handleClick = async () => {
    try {
      await axios.post("/api/user/skills", { skills });
      toast.success("Skills updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-2/3 mx-auto space-y-4">
      <SkillPreview skills={skills} />
      <Core skills={skills} setSkills={setSkills} />
      <Frontend skills={skills} setSkills={setSkills} />
      <Backend skills={skills} setSkills={setSkills} />
      <Other skills={skills} setSkills={setSkills} />
      <div className="flex items-start mt-8 w-full">
        <Button onClick={handleClick} className="w-full" variant="secondary">
          Save
        </Button>
      </div>
    </div>
  );
};

export default SkillForm;
