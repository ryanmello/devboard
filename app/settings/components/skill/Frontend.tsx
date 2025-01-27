import React, { Dispatch, SetStateAction } from 'react'

interface FrontendProps {
  skills: string[];
  setSkills: Dispatch<SetStateAction<string[]>>;
}

const Frontend = ({ skills, setSkills }: FrontendProps) => {
  return (
    <div>Frontend</div>
  )
}

export default Frontend