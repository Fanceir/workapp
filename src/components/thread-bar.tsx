import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";
import { zhCN } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ThreadBarProps {
  count?: number;
  image?: string;
  timestamp?: number;
  name?: string;
  onClick: () => void;
}

const ThreadBar = ({
  count,
  image,
  timestamp,
  onClick,
  name = "Member",
}: ThreadBarProps) => {
  if (!count || !timestamp) return null;
  const avatarFallback = name.charAt(0).toUpperCase();
  return (
    <button
      onClick={onClick}
      className="p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-start group/thread-bar transition max-w-[600px]"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="size-6 shrink-0">
          <AvatarImage src={image} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className="text-xs text-sky-700 hover:underline font-bold truncate">
          {count} {count > 1 ? "replies" : "reply"}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
          最新回复于{" "}
          {formatDistanceToNow(timestamp, { locale: zhCN, addSuffix: true })}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
          立刻查看
        </span>
      </div>
      <ChevronRight className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0" />
    </button>
  );
};
export default ThreadBar;
