import { format, isToday, isYesterday } from "date-fns";
import { Doc, Id } from "../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import Hint from "./hint";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import Thumbnail from "./thumbnail";
import Toolbar from "./toolbar";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useConfirm } from "@/hooks/use-confirm";
import { useToggleReactions } from "@/features/reactions/api/use-toggle-reaction";
import { Reactions } from "./reactions";
import { usePanel } from "@/hooks/use-panel";
import ThreadBar from "./thread-bar";
import { Loader } from "lucide-react";
import { Suspense } from "react";
const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (Id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadName?: string;
  threadTimestamp?: number;
}

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "今天" : isYesterday(date) ? "昨天" : format(date, "yyyy MM dd")} ${format(date, "HH:mm:ss")}`;
};

export const Message = ({
  id,
  isAuthor,
  memberId,
  authorImage,
  authorName = "Member",
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  setEditingId,
  isCompact,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
  threadName,
}: MessageProps) => {
  const { parentMessageId, onOpenMessage, onClose, onOpenProfile } = usePanel();
  const confirmFn = useConfirm();
  const confirm = typeof confirmFn === "function" ? confirmFn : () => confirmFn;

  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage();
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReactions();
  const isPending = isUpdatingMessage || isTogglingReaction;
  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("消息已更新");
          setEditingId(null);
        },
        onError: () => {
          toast.error("消息更新失败");
        },
      }
    );
  };

  const handleDelete = async () => {
    const ok = await confirm("确定要删除消息吗？", "删除后无法恢复");
    if (!ok) return;
    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("已删除消息");
          if (parentMessageId === id) {
            onClose();
          }
        },
        onError: () => {
          toast.error("删除消息失败");
        },
      }
    );
  };

  const handleReaction = (value: string) => {
    toggleReaction(
      { messageId: id, value },
      {
        onError: () => {
          toast.error("无法回应消息");
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-yellow-50 hover:bg-yellow-50",
            isRemovingMessage &&
              "bg-rose-500/50 transform-all scale-y-0 origin-bottom duration-500"
          )}
        >
          <div className="flex items-start gap-1">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), "HH:mm ")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="w-full h-full">
                <Suspense
                  fallback={
                    <div className="h-full flex items-center justify-center">
                      <Loader className="size-6 animate-spin text-muted-foreground" />
                    </div>
                  }
                >
                  <Editor
                    onSubmit={handleUpdate}
                    disabled={isPending}
                    defaultValue={JSON.parse(body)}
                    onCancel={() => setEditingId(null)}
                    variant="update"
                  />
                </Suspense>
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <Renderer value={body} />
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground ">
                    (已编辑)
                  </span>
                ) : null}
                <Reactions data={reactions} onChange={handleReaction} />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  timestamp={threadTimestamp}
                  name={threadName}
                  onClick={() => onOpenMessage(id)}
                />
              </div>
            )}
          </div>
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={false}
              handleEdit={() => {
                setEditingId(id);
              }}
              handleReaction={handleReaction}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleDelete}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }
  const avatarFallback = authorName.charAt(0).toUpperCase();

  return (
    <>
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-yellow-50 hover:bg-yellow-50",
          isRemovingMessage &&
            "bg-rose-500/50 transform-all scale-y-0 origin-bottom duration-500"
        )}
      >
        <div className="flex items-start gap-1">
          <button onClick={() => onOpenProfile(memberId)}>
            <Avatar>
              <AvatarImage src={authorImage} className="rounded-md" />
              <AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="w-full h-full">
              <Suspense
                fallback={
                  <div className="h-full flex items-center justify-center">
                    <Loader className="size-6 animate-spin text-muted-foreground" />
                  </div>
                }
              >
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </Suspense>
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button
                  onClick={() => {}}
                  className="font-bold text-primary hover:underline"
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline"></button>
                </Hint>
              </div>
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className="text-xs text-muted-foreground ">(已编辑)</span>
              ) : null}
              <Reactions data={reactions} onChange={handleReaction} />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                timestamp={threadTimestamp}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => {
              setEditingId(id);
            }}
            handleReaction={handleReaction}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleDelete}
            hideThreadButton={hideThreadButton}
          />
        )}
        <Reactions data={reactions} onChange={handleReaction} />
      </div>
    </>
  );
};
