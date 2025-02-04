import { FullUser } from "@/types";
// import Languages from "@/public/languages.jpg";
import Image from "next/image";

const SkillsTab = ({ currentUser }: { currentUser: FullUser }) => {
  return (
    <div className="pt-8">
      {/* <Image src={Languages} alt="none" width={1000} height={1000} /> */}
      Skills
    </div>
  );
};

export default SkillsTab;
