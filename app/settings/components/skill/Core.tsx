import React, { Dispatch, SetStateAction } from 'react'

interface CoreProps {
  skills: string[];
  setSkills: Dispatch<SetStateAction<string[]>>;
}

const Core = ({ skills, setSkills }: CoreProps) => {
  return (
    <div>Core</div>
  )
}

export default Core