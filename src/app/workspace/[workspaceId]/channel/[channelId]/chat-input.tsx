import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { Suspense, useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Loader } from "lucide-react";
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder?: string;
}

type createMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image: Id<"_storage"> | undefined;
};

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [pending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
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
  return (
    <div className="px-5 w-full">
      <Suspense
        fallback={
          <div className="h-full flex items-center justify-center">
            <Loader className="size-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <Editor
          variant="create"
          key={editorKey}
          placeholder={placeholder}
          onSubmit={handleSubmit}
          disabled={pending}
          innerRef={editorRef}
        />
      </Suspense>
    </div>
  );
};
