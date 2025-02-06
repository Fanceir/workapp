import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { Loader, TriangleAlert, XIcon } from "lucide-react";
import { UseGetMessage } from "../api/use-get-message";
import { Message } from "@/components/message";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useCreateMessage } from "../api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/hooks/use-channel-id";
import { toast } from "sonner";
import { useGetMessages } from "../api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";

const TIME_THRESHOLD = 2;
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

type createMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image: Id<"_storage"> | undefined;
};

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) {
    return "今天";
  }
  if (isYesterday(date)) {
    return "昨天";
  }
  return format(date, "yyyy-MM-dd");
};

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const { data: message, isLoading: loadingMessage } = UseGetMessage({
    id: messageId,
  });
  const editorRef = useRef<Quill | null>(null);
  const channelId = useChannelId();
  const [editorKey, setEditorKey] = useState(0);
  const [pending, setIsPending] = useState(false);
  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });
  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";
  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);
      const values: createMessageValues = {
        channelId,
        workspaceId,
        parentMessageId: messageId,
        body,
        image: undefined,
      };
      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) {
          throw new Error("上传失败");
        }
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });
        if (!result.ok) {
          throw new Error("上传失败");
        }
        const { storageId } = await result.json();
        values.image = storageId;
      }
      await createMessage(values, { throwError: true });
      // editorRef?.current?.setContents([]);
      setEditorKey((prev) => prev + 1);
    } catch {
      toast.error("发送失败");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  const groupedMessages = results?.reduce(
    (groups, message) => {
      const data = new Date(message._creationTime);
      const dateKey = format(data, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof results>
  );
  if (loadingMessage || status === "LoadingFirstPage")
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
    <div>
      <div className="h-full flex flex-col">
        <div className="flex  h-[49px] justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">会话</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-1 flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
          {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
            <div key={dateKey}>
              <div className="text-center my-2 relative">
                <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                  {formatDateLabel(dateKey)}
                </span>
              </div>
              {messages.map((message, index) => {
                const previousMessage = messages[index - 1];
                const isCompact =
                  previousMessage &&
                  previousMessage.user?._id === message.user?._id &&
                  differenceInMinutes(
                    new Date(message._creationTime),
                    new Date(previousMessage._creationTime)
                  ) < TIME_THRESHOLD;

                return (
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
                    isCompact={isCompact}
                    threadCount={message.threadCount}
                    threadImage={message.threadImage}
                    threadName={message.threadName}
                    threadTimestamp={message.threadTimestamp}
                  />
                );
              })}
            </div>
          ))}
          <div
            className="h-1"
            ref={(el) => {
              if (el) {
                const observer = new IntersectionObserver(
                  ([entry]) => {
                    if (entry.isIntersecting && canLoadMore) {
                      loadMore();
                    }
                  },
                  { threshold: 1.0 }
                );

                observer.observe(el);

                return () => observer.disconnect();
              }
            }}
          />
          {isLoadingMore && (
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                <Loader className="size-4 animate-spin" />
              </span>
            </div>
          )}
          <Message
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
      </div>
      <div className="px-4">
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          innerRef={editorRef}
          disabled={pending}
          placeholder="回复消息..."
        />
      </div>
    </div>
  );
};
