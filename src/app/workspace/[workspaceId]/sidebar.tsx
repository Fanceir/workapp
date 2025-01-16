import { UserButton } from "@/features/auth/components/user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import SidebarButton from "./sidebarbutton";
import {
  BellIcon,
  HomeIcon,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { usePathname } from "next/navigation";
export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-[70px] h-full bg-[#83C4FF] flex flex-col gap-y-4 items-center pt-[9px] pb-4 ">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={HomeIcon}
        label="主页"
        isActive={pathname.includes("/workspace")}
      />
      <SidebarButton icon={MessageSquare} label="消息中心" />
      <SidebarButton icon={BellIcon} label="消息提醒" />
      <SidebarButton icon={MoreHorizontal} label="More" />
      <div className=" flex flex-col items-center gap-y-1 justify-center mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};
