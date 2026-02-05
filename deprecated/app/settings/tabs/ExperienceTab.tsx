import { FullUser } from "@/types";
import AddExperience from "../components/experience/AddExperience";
import YourExperiences from "../components/experience/YourExperiences";

const ExperienceTab = ({ currentUser }: { currentUser: FullUser }) => {
  return (
    <div className="flex flex-col items-center pt-8">
      <AddExperience />
      <YourExperiences currentUser={currentUser} />
    </div>
  );
};

export default ExperienceTab;
