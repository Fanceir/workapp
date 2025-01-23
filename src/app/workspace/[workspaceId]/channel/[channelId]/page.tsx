"use client";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { Header } from "./header";
import { ChatInput } from "./chat-input";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });
  if (channelLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="animate-spin size-5 text-muted-foreground"></Loader>
      </div>
    );
  }
  if (!channel) {
    return (
      <div className="h-full flex-1 flex gap-y-2 items-center justify-center">
        <TriangleAlert className=" size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground"> 无法查找到频道</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <TriangleAlert className="size-5 text-muted-foreground"></TriangleAlert>
            <span className="text-sm text-muted-foreground">
              无法查找到消息
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex pb-0">
        <ChatInput placeholder={`在${channel.name}频道写些东西`} />
      </div>
    </div>
  );
};

export default ChannelIdPage;
