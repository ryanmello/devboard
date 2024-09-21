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
          "relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none cursor-pointer gap-4 hover:bg-primary-foreground",
          variant === routeVariant && "bg-primary-foreground"
        )}
      >
        <Icon className="h-6 w-6" />
        <span>{label}</span>
      </div>
    </li>
  );
};

export default SettingsSidebarItem;
