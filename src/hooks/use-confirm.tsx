import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

// 定义确认对话框参数类型
interface ConfirmOptions {
  title: string;
  message: string;
}

// 全局状态管理
type ConfirmState = {
  options: ConfirmOptions | null;
  resolve: ((value: boolean) => void) | null;
};

// 创建一个模块级别的状态
let confirmState: ConfirmState = {
  options: null,
  resolve: null,
};

// 订阅状态变化的监听器
const listeners = new Set<(state: ConfirmState) => void>();

// 更新状态并通知所有监听器
function setConfirmState(newState: ConfirmState) {
  confirmState = newState;
  listeners.forEach((listener) => listener(confirmState));
}

// 核心确认函数
function confirmDialog(title: string, message: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    setConfirmState({
      options: { title, message },
      resolve,
    });
  });
}

// 清除当前确认对话框
function closeConfirm(result: boolean) {
  if (confirmState.resolve) {
    confirmState.resolve(result);
  }
  setConfirmState({
    options: null,
    resolve: null,
  });
}

// 公开的简化版 useConfirm hook
export function useConfirm(
  title?: string,
  message?: string
): Promise<boolean> | ((title: string, message: string) => Promise<boolean>) {
  // 如果直接传入参数，则直接执行确认对话框
  if (title && message) {
    return confirmDialog(title, message);
  }

  // 否则返回一个函数以便后续调用
  return (dialogTitle: string, dialogMessage: string) =>
    confirmDialog(dialogTitle, dialogMessage);
}

// 对话框提供者组件 - 只需要在应用中引入一次
export function ConfirmProvider({ children }: { children: ReactNode }) {
  // 本地状态以触发重新渲染
  const [state, setState] = useState<ConfirmState>(confirmState);

  // 监听全局状态变化
  useState(() => {
    const listener = (newState: ConfirmState) => {
      setState({ ...newState });
    };

    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  });

  const handleClose = useCallback(() => {
    closeConfirm(false);
  }, []);

  const handleCancel = useCallback(() => {
    closeConfirm(false);
  }, []);

  const handleConfirm = useCallback(() => {
    closeConfirm(true);
  }, []);

  return (
    <>
      {children}
      <Dialog open={state.options !== null} onOpenChange={handleClose}>
        {state.options && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{state.options.title}</DialogTitle>
              <DialogDescription>{state.options.message}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-2">
              <Button variant="outline" onClick={handleCancel}>
                取消
              </Button>
              <Button onClick={handleConfirm}>确认</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
