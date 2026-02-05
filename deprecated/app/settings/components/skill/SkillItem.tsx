"use client";

import clsx from "clsx";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface SkillItemProps {
  name: string;
  image: string;
  skills: string[];
  setSkills: Dispatch<SetStateAction<string[]>>;
}

const SkillItem: React.FC<SkillItemProps> = ({
  name,
  image,
  skills,
  setSkills,
}) => {
  const [isGrayScale, setIsGrayScale] = useState(true);
  const handleClick = () => {
    if (isGrayScale) {
      setSkills([...skills, name]);
    } else {
      const filteredSkills = skills.filter((skill) => skill !== name);
      setSkills(filteredSkills);
    }

    setIsGrayScale(!isGrayScale);
  };

  useEffect(() => {
    if (skills.includes(name)) {
      setIsGrayScale(false);
    }
  }, [skills, name]);

  return (
    <Image
      src={image}
      alt={name}
      width={50}
      height={50}
      className={clsx(
        "cursor-pointer hover:opacity-100 p-1 rounded-xl",
        isGrayScale && "grayscale opacity-60"
      )}
      onClick={handleClick}
    />
  );
};

export default SkillItem;
