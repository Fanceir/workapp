import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder?: string;
  conversationId: Id<"conversations">;
}

type createMessageValues = {
  conversationId: Id<"conversations">;
  workspaceId: Id<"workspaces">;
  body: string;
  image: Id<"_storage"> | undefined;
};

export const ChatInput = ({ placeholder,conversationId }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [pending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);
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
        conversationId,
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
      <Editor
        variant="create"
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={pending}
        innerRef={editorRef}
      />
    </div>
  );
};
