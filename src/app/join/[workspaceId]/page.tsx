"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useJoin } from "@/features/workspaces/api/use-join";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import VerificationIput from "react-verification-input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useEffect, useMemo } from "react";


const JoinPage = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
  const { mutate, isPending } = useJoin();
  const router = useRouter();

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);
  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  const handleComplete = (value: string) => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: (id) => {
          toast.success("加入成功");
          router.replace(`/workspace/${id}`);
        },
        onError: () => {
          toast.error("加入失败");
        },
      }
    );
  };
  return (
    <div className="h-full flex flex-col gap-y-8 items-center  justify-center bg-white p-8 rounded-lg shadow-sm">
      <Image src="/logo.svg" width={60} height={60} alt="logo" />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl  font-bold">加入{data?.name ?? "工作区"}</h1>
          <p className="text-sm text-gray-500">请填写工作区邀请码</p>
        </div>
        <VerificationIput
          onComplete={handleComplete}
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPending && "opactiy-50 cursor-not-allowed"
            ),
            character:
              "uppercase h-auto rounded-md border border=gray-300 flex items-center justify-center text-lg font-medium text-gray-300",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          length={6}
          autoFocus
        />
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">返回</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
