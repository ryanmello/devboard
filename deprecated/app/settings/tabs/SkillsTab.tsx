import { FullUser } from "@/types";
import SkillForm from "../components/skill/SkillForm";

const SkillsTab = ({ currentUser }: { currentUser: FullUser }) => {
  return (
    <div className="pt-8">
      <SkillForm currentUser={currentUser} />
    </div>
  );
};

export default SkillsTab;
