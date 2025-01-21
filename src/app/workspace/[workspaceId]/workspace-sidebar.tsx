import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import WorkspaceHeader from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import WorkspaceSection from "./workspace-section";
import { useGetMembers } from "@/features/members/api/use-get-members";
import UserItem from "./user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-model";
import { useChannelId } from "@/hooks/use-channel-id";
export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsIsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });
  const [_open, setOpen] = useCreateChannelModal();

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col bg-[#6ab3f8]] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }
  if (!workspace || !member) {
    return (
      <div className="flex flex-col bg-[#6ab3f8]] h-full items-center justify-center">
        <AlertTriangle className="size-5  text-white" />
        <p className="text-white text-sm mt-2">
          你不是这个工作区的成员，或者工作区不存在
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col bg-[#6ab3f8]] h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="聊天" icon={MessageSquareText} id="chat" />
        <SidebarItem label="已发送" icon={SendHorizonal} id="drafts" />{" "}
      </div>
      <WorkspaceSection
        label="频道"
        hint="新建频道"
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            label={item.name}
            icon={HashIcon}
            id={item._id}
            variant={channelId === item._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label="成员"
        hint="创建新对话"
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {members?.map((item) => (
          <UserItem key={item._id} id={item._id} label={item.user.name} />
        ))}
      </WorkspaceSection>
    </div>
  );
};
export default WorkspaceSidebar;
