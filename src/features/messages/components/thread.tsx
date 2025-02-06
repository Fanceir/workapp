import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { Loader, TriangleAlert, XIcon } from "lucide-react";
import { UseGetMessage } from "../api/use-get-message";
import { Message } from "@/components/message";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useState } from "react";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}
export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const { data: message, isLoading: loadingMessage } = UseGetMessage({
    id: messageId,
  });
  if (loadingMessage)
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">会话</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="h-full flex items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex  h-[49px] justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">会话</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <TriangleAlert className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">消息找不到</p>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col">
      <div className="flex  h-[49px] justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">会话</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <Message
        key={message._id}
        hideThreadButton
        memberId={message.memberId}
        authorImage={message.user.image}
        authorName={message.user.name}
        isAuthor={message.memberId === currentMember?._id}
        body={message.body}
        image={message.image}
        createdAt={message._creationTime}
        updatedAt={message.updatedAt}
        id={message._id}
        reactions={message.reactions}
        isEditing={editingId === message._id}
        setEditingId={setEditingId}
      />
    </div>
  );
};
