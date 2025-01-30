import { SettingsVariant } from "@/types";
import {
  BookText,
  BriefcaseBusiness,
  ContactRound,
  FileCode2,
  FolderGit2,
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import SettingsSidebarItem from "./SettingsSidebarItem";

interface SettingsSidebarProps {
  variant: SettingsVariant;
  setVariant: Dispatch<SetStateAction<SettingsVariant>>;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  variant,
  setVariant,
}) => {
  const settingsRoutes = [
    {
      label: "Profile" as string,
      routeVariant: "Profile" as SetStateAction<SettingsVariant>,
      icon: ContactRound,
    },
    {
      label: "Skills" as string,
      routeVariant: "Skills" as SetStateAction<SettingsVariant>,
      icon: FileCode2,
    },
    {
      label: "Education" as string,
      routeVariant: "Education" as SetStateAction<SettingsVariant>,
      icon: BookText,
    },
    {
      label: "Experience" as string,
      routeVariant: "Experience" as SetStateAction<SettingsVariant>,
      icon: BriefcaseBusiness,
    },
    {
      label: "Projects" as string,
      routeVariant: "Projects" as SetStateAction<SettingsVariant>,
      icon: FolderGit2,
    },
  ];

  return (
    <div className="border-r p-4 fixed h-full w-64">
      <div className="flex px-2 gap-2 mb-4">
        {/* <Settings className="h-6 w-6"/> */}
        <p className="font-bold">Settings</p>
      </div>
      <nav className="flex flex-col justify-between">
        <ul className="flex flex-col">
          {settingsRoutes.map((route, index) => (
            <SettingsSidebarItem
              key={index}
              label={route.label}
              routeVariant={route.routeVariant}
              icon={route.icon}
              variant={variant}
              setVariant={setVariant}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SettingsSidebar;
