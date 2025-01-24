import { FullUser } from '@/types'
import AddEducation from '../components/education/AddEducation'
import YourEducation from '../components/education/YourEducation'

const EducationTab = ({ currentUser }: { currentUser: FullUser }) => {
  return (
    <div className='flex flex-col items-center pt-8'>
      <AddEducation />
      {/* <YourEducation /> */}
    </div>
  )
}

export default EducationTab
