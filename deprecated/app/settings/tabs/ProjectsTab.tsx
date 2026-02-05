import { FullUser } from '@/types'
import YourProjects from '../components/projects/YourProjects'
import AddProject from '../components/projects/AddProject'

const ProjectsTab = ({ currentUser }: { currentUser: FullUser }) => {
  return (
    <div className="flex flex-col items-center pt-8">
      <AddProject />
      <YourProjects currentUser={currentUser} />
    </div>
  )
}

export default ProjectsTab
