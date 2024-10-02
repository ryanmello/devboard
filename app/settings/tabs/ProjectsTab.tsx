import { FullUser } from '@/types'
import NewProject from '../components/projects/NewProject'
import YourProjects from '../components/projects/YourProjects'

const ProjectsTab = ({ currentUser }: { currentUser: FullUser }) => {
  return (
    <div className="flex flex-col items-center pt-4">
      <NewProject totalProjects={currentUser.projects.length} />
      <YourProjects projects={currentUser.projects} />
    </div>
  )
}

export default ProjectsTab
