import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlertIcon } from "lucide-react";
import { SignInFlow } from "@/features/auth/types";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

type Flow = "signIn" | "verifyCode" | "resetRequest" | "resetConfirm";

export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<Flow>("signIn"); // 当前流程状态
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(""); // 验证码
  const [newPassword, setNewPassword] = useState(""); // 新密码
  const [error, setError] = useState("");

  // 处理账号密码登录
  const onPasswordSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      await signIn("password", { email, password, flow: "signIn" });
    } catch {
      setError("登录失败，请检查您的邮箱和密码");
    } finally {
      setPending(false);
    }
  };

  // 处理第三方登录（Google/GitHub）
  const onProviderSignIn = async (provider: "google" | "github") => {
    setPending(true);
    setError("");
    try {
      await signIn(provider);
    } catch {
      setError("登录失败，请重试");
    } finally {
      setPending(false);
    }
  };

  // 发送验证码
  const sendVerificationCode = async () => {
    setPending(true);
    try {
      await signIn("resend-otp", { email });
      setFlow("verifyCode"); // 切换到验证码输入页面
    } catch {
      setError("验证码发送失败，请输入正确的邮箱或稍后再试");
    } finally {
      setPending(false);
    }
  };

  // 验证验证码
  const verifyCode = async () => {
    setPending(true);
    setError("");
    try {
      await signIn("resend-otp", { email, code });
      setFlow("signIn"); // 验证成功后返回登录页面
    } catch {
      setError("验证码错误，请重试");
    } finally {
      setPending(false);
    }
  };

  // 发送重置密码验证码
  const sendPasswordResetCode = async () => {
    setPending(true);
    setError("");
    try {
      await signIn("resend-otp-password-reset", {
        email,
        flow: "reset",
      });
      setFlow("resetConfirm"); // 切换到验证码输入页面
      setError("验证码已发送，请查收邮箱");
    } catch {
      setError("验证码发送失败，请重试");
    } finally {
      setPending(false);
    }
  };

  // 重置密码
  const handlePasswordReset = async () => {
    setPending(true);
    setError("");
    try {
      await signIn("resend-otp-password-reset", {
        email,
        code,
        newPassword,
        flow: "reset-verification", // 验证流程
      });
      setFlow("signIn"); // 重置成功后返回登录页面
      setError("密码重置成功，请重新登录");
    } catch {
      setError("密码重置失败，请检查验证码和新密码");
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>
          {flow === "signIn" && "登录以继续"}
          {flow === "verifyCode" && "验证码登录"}
          {flow === "resetRequest" && "重置密码"}
          {flow === "resetConfirm" && "重置密码"}
        </CardTitle>
        <CardDescription>
          {flow === "signIn" && "使用邮箱或其他服务以继续"}
          {flow === "verifyCode" && `验证码已发送至 ${email}`}
          {flow === "resetRequest" && "请输入您的邮箱以接收验证码"}
          {flow === "resetConfirm" && "请输入验证码和新密码"}
        </CardDescription>
      </CardHeader>

      {/* 错误提示 */}
      {!!error && (
        <div className="bg-destructive/15 rounded-md flex p-3 items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlertIcon className="size-4" />
          <p>{error}</p>
        </div>
      )}

      <CardContent className="space-y-5 px-0 pb-0">
        {/* 登录页面 */}
        {flow === "signIn" && (
          <>
            <form className="space-y-2.5" onSubmit={onPasswordSignIn}>
              <Input
                disabled={pending}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email/邮箱"
                type="email"
                required
              />
              <Input
                disabled={pending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                type="password"
                required
              />
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={pending}
              >
                {pending ? "登录中..." : "继续"}
              </Button>
            </form>

            <Separator />

            <div className="flex flex-col gap-y-2.5">
              <Button
                disabled={pending}
                onClick={() => onProviderSignIn("google")}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <FcGoogle className="size-5 mr-2" />
                使用 Google 登录
              </Button>
              <Button
                disabled={pending}
                onClick={() => onProviderSignIn("github")}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <FaGithub className="size-5 mr-2" />
                使用 GitHub 登录
              </Button>
              <Button
                disabled={pending}
                onClick={sendVerificationCode}
                variant="outline"
                size="lg"
                className="w-full"
              >
                📧 使用验证码登录
              </Button>
            </div>

            <div className="text-xs space-y-2">
              <p className="text-muted-foreground">
                没有账号？
                <span
                  onClick={() => setState("signUp")}
                  className="text-sky-700 hover:underline cursor-pointer ml-1"
                >
                  注册一个
                </span>
              </p>
              <p className="text-muted-foreground">
                忘记密码了？
                <span
                  onClick={() => setFlow("resetRequest")}
                  className="text-sky-700 hover:underline cursor-pointer ml-1"
                >
                  重置密码
                </span>
              </p>
            </div>
          </>
        )}

        {/* 验证码登录页面 */}
        {flow === "verifyCode" && (
          <div className="space-y-4">
            <Input
              disabled={pending}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="验证码"
              required
            />
            <Button
              onClick={verifyCode}
              className="w-full"
              size="lg"
              disabled={pending}
            >
              {pending ? "验证中..." : "验证"}
            </Button>
            <Button
              onClick={() => setFlow("signIn")}
              variant="outline"
              className="w-full"
              size="lg"
              disabled={pending}
            >
              返回登录
            </Button>
          </div>
        )}

        {/* 重置密码请求页面 */}
        {flow === "resetRequest" && (
          <div className="space-y-4">
            <Input
              disabled={pending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email/邮箱"
              type="email"
              required
            />
            <Button
              onClick={sendPasswordResetCode}
              className="w-full"
              size="lg"
              disabled={pending || !email}
            >
              {pending ? "发送中..." : "发送验证码"}
            </Button>
            <Button
              onClick={() => setFlow("signIn")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              返回登录
            </Button>
          </div>
        )}

        {/* 重置密码确认页面 */}
        {flow === "resetConfirm" && (
          <div className="space-y-4">
            <Input
              disabled={pending}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="验证码"
              required
            />
            <Input
              disabled={pending}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="新密码"
              type="password"
              required
              minLength={8}
            />
            <Button
              onClick={handlePasswordReset}
              className="w-full"
              size="lg"
              disabled={pending || !code || !newPassword}
            >
              {pending ? "重置中..." : "重置密码"}
            </Button>
            <Button
              onClick={() => setFlow("resetRequest")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              返回
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
