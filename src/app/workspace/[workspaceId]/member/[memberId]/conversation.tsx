import { useMemberId } from "@/hooks/use-member-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader } from "lucide-react";
import Header from "./header";
import { ChatInput } from "./chat-input";
import { MessageList } from "@/components/message-list";
import { usePanel } from "@/hooks/use-panel";

interface ConversationProps {
  id: Id<"conversations">;
}
export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });
  const { onOpenProfile } = usePanel();
  const { results, status, loadMore } = useGetMessages({ conversationId: id });
  if (memberLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => {
          onOpenProfile(memberId);
        }}
      />
      <MessageList
        data={results}
        memberImage={member?.user.image}
        memberName={member?.user.name}
        variant="conversation"
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />

      <ChatInput
        placeholder="向${member?.user.name}发送消息"
        conversationId={id}
      />
    </div>
  );
};
