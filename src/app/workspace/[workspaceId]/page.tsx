"use client";

import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-model";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";
import { Loader, TriangleAlert } from "lucide-react";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCurrentMember } from "@/features/members/api/use-current-member";
const WorkspaceIdPage = () => {
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId: useWorkspaceId(),
  });
  const isAdmin = useMemo(() => member?.role === "admin", [member]);
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId: workspaceId,
  });
  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  useEffect(() => {
    if (
      workspaceLoading ||
      channelsLoading ||
      memberLoading ||
      !member ||
      !workspace
    )
      return;
    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    channelId,
    member,
    memberLoading,
    isAdmin,
    setOpen,
    router,
    open,
    workspaceId,
    workspaceLoading,
    workspace,
    channelsLoading,
  ]);

  if (workspaceLoading || channelsLoading)
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  if (!workspace || !member) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">工作区没有找到</span>
      </div>
    );
  }
  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6  text-muted-foreground" />
      <span className="text-sm text-muted-foreground">频道没有找到</span>
    </div>
  );
};
export default WorkspaceIdPage;
