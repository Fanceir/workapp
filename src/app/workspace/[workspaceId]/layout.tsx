"use client";
import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Thread } from "@/features/messages/components/thread";
import Profile from "@/features/members/components/profile";
interface WorkspaceLayoutProps {
  children: React.ReactNode;
}
const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
  const { parentMessageId, onClose, profileMemberId } = usePanel();
  const showPanel = !!parentMessageId || !!profileMemberId;

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-10px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="fx-workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#79beff] "
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={50} defaultSize={80}>{children}</ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onClose}
                  />
                ) : profileMemberId ? (
                  <Profile
                  memberId={profileMemberId as Id<"members">}
                  onClose={onClose}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
