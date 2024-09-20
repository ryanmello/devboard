import { cn } from "@/lib/utils";
import { SettingsVariant } from "@/types";
import { Dispatch, SetStateAction } from "react";

interface SettingsTabProps {
  label: string;
  routeVariant: SetStateAction<SettingsVariant>;
  icon: any;
  variant: SettingsVariant;
  setVariant: Dispatch<SetStateAction<SettingsVariant>>;
}

const SettingsSidebarItem: React.FC<SettingsTabProps> = ({
  label,
  routeVariant,
  icon: Icon,
  variant,
  setVariant,
}) => {
  return (
    <li onClick={() => setVariant(routeVariant)}>
      <div
        className={cn(
          "flex items-center mb-1 p-2 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white cursor-pointer",
          variant === routeVariant && "text-white bg-neutral-800"
        )}
      >
        <Icon className="h-6 w-6 mr-2" />
        <span>{label}</span>
      </div>
    </li>
  );
};

export default SettingsSidebarItem;
