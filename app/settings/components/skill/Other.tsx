import React, { Dispatch, SetStateAction } from 'react'

interface OtherProps {
    skills: string[];
    setSkills: Dispatch<SetStateAction<string[]>>;
}

const Other = ({ skills, setSkills }: OtherProps) => {
  return (
    <div>Other</div>
  )
}


export default Other