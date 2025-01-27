import React, { Dispatch, SetStateAction } from 'react'

interface BackendProps {
  skills: string[];
  setSkills: Dispatch<SetStateAction<string[]>>;
}

const Backend = ({ skills, setSkills }: BackendProps) => {
  return (
    <div>Backend</div>
  )
}

export default Backend