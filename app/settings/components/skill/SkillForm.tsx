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

const SkillForm = ({ currentUser }: { currentUser: FullUser }) => {
  const [skills, setSkills] = useState<string[]>(currentUser.skills);

  const handleClick = async () => {
    try {
      const response = await axios.post("/api/skills", skills);
      toast.success("Skills updated");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center pt-4">
      <Core skills={skills} setSkills={setSkills} />
      <Frontend skills={skills} setSkills={setSkills} />
      <Backend skills={skills} setSkills={setSkills} />
      <Other skills={skills} setSkills={setSkills} />
      <div className="flex items-start w-1/3 mt-4">
        <Button onClick={handleClick}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default SkillForm;
