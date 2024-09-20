import { SettingsVariant } from "@/types";
import { PersonStanding } from "lucide-react";
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
      icon: PersonStanding,
    },
    {
      label: "Skills" as string,
      routeVariant: "Skills" as SetStateAction<SettingsVariant>,
      icon: PersonStanding,
    },
    {
      label: "Education" as string,
      routeVariant: "Education" as SetStateAction<SettingsVariant>,
      icon: PersonStanding,
    },
    {
      label: "Experience" as string,
      routeVariant: "Experience" as SetStateAction<SettingsVariant>,
      icon: PersonStanding,
    },
    {
      label: "Projects" as string,
      routeVariant: "Projects" as SetStateAction<SettingsVariant>,
      icon: PersonStanding,
    },
  ];

  return (
    <div className="border-r p-4 fixed h-full w-64">
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
