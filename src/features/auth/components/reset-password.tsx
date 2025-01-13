import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface ResetPasswordProps {
  handleCancel: () => void;
  provider: string;
}

export function ResetPassword({ handleCancel, provider }: ResetPasswordProps) {
  const { signIn } = useAuthActions();
  const { toast } = useToast();
  const [step, setStep] = useState<"forgot" | "verify">("forgot");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("flow", "reset");
      await signIn(provider, formData);
      setStep("verify");
      toast({
        title: "验证码已发送",
        description: "请检查您的邮箱",
      });
    } catch {
      toast({
        title: "发送验证码失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return step === "forgot" ? (
    <>
      <h2 className="font-semibold text-2xl tracking-tight">
        发送密码重置验证码
      </h2>
      <form className="space-y-4" onSubmit={handleSendCode}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            邮箱地址
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="请输入邮箱地址"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          发送验证码
        </Button>
        <Button type="button" variant="link" onClick={handleCancel}>
          取消
        </Button>
      </form>
    </>
  ) : (
    <>
      <h2 className="font-semibold text-2xl tracking-tight">检查您的邮箱</h2>
      <p className="text-muted-foreground text-sm">
        请输入我们发送到您邮箱的8位验证码并设置新密码。
      </p>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitting(true);
          const formData = new FormData(event.currentTarget);
          formData.append("email", email);
          signIn(provider, formData).catch(() => {
            toast({
              title: "验证码验证失败或新密码太短，请重试",
              variant: "destructive",
            });
            setSubmitting(false);
          });
        }}
      >
        <div className="space-y-2">
          <label htmlFor="code" className="text-sm font-medium">
            验证码
          </label>
          <Input
            id="code"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="请输入验证码"
            maxLength={8}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="newPassword" className="text-sm font-medium">
            新密码
          </label>
          <Input
            type="password"
            name="newPassword"
            id="newPassword"
            autoComplete="new-password"
            placeholder="请输入新密码"
            required
            minLength={6}
          />
        </div>

        <input type="hidden" name="flow" value="reset-verification" />

        <div className="space-y-2">
          <Button type="submit" className="w-full" disabled={submitting}>
            重置密码
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={() => setStep("forgot")}
          >
            返回
          </Button>
        </div>
      </form>
    </>
  );
}
