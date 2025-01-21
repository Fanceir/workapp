import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useConfirm } from "@/hooks/use-confirm";
interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}
export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "确定要创建一个新的邀请码吗？",
    "创建新的邀请链接时，旧的邀请码将失效"
  );
  const { mutate, isPending } = useNewJoinCode();
  const handleNewCode = async () => {
    const confirmed = await confirm();
    if (!confirmed) {
      return;
    }

    mutate(
      { id: workspaceId },
      {
        onSuccess: () => {
          toast.success("新的邀请码已创建");
        },
        onError: () => {
          toast.error("创建新的邀请码时出错");
        },
      }
    );
  };
  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success("邀请链接已复制到剪贴板");
    });
  };
  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>邀请别人加入{name}</DialogTitle>
            <DialogDescription>
              使用以下链接邀请别人加入{name}工作区
            </DialogDescription>
            <div className="flex flex-col gap-y-4 items-center justify-center py-10">
              <p className="text-4xl font-bold tracking-widest uppercase">
                {joinCode}
              </p>
              <Button onClick={handleCopy} variant="ghost" size="sm">
                复制邀请链接
                <CopyIcon calcMode={"currentColor"} className="size-4 ml-2" />
              </Button>
            </div>
            <div className="flex justify-between items-center w-full">
              <Button onClick={handleNewCode} variant="outline">
                创建一个新的邀请码
                <RefreshCcw className="size-4 ml-2" />
              </Button>
              <DialogClose asChild>
                <Button>关闭</Button>
              </DialogClose>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
