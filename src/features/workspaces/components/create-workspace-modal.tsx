"use client";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"

export const CreateWorkspaceModal = () => {
  const [open, setOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState("");
  const router = useRouter();
  const { mutate, isPending } = useCreateWorkspace();
  const handleClose = () => {
    setOpen(false);
    setName("");
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name },
      {
        onSuccess(id) {
          // console.log(id);
          toast.success("工作空间创建成功");
          console.log("workspace creaasasa1ted");
          router.push(`/workspace/${id}`);
          handleClose();
        },
      }
    );
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增一个工作空间</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            disabled={isPending}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            minLength={3}
            placeholder="工作空间名称 例如：'设计团队' / '开发团队'"
          />
          <div className="flex justify-end">
            <Button disabled={false} type="submit">
              创建
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
