import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useState, useMemo } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
type RequesetType = { name: string; workspaceId: Id<"workspaces"> };
type ResponenseType = Id<"channels">;
type Options = {
  onSuccess?: (data: ResponenseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};
export const useCreateChannel = () => {
  const [data, setData] = useState<ResponseType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const [status, setStatus] = useState<
    "settled" | "pending" | "success" | "error" | null
  >(null);
  const isPending = useMemo(() => status === "pending", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);
  const mutation = useMutation(api.channels.create);
  const mutate = useCallback(
    async (values: RequesetType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");
        const response = await mutation(values);
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setStatus("error");
        options?.onError?.(error as Error);
        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );
  return { mutate, isPending, data, error, isSuccess, isError, isSettled };
};
