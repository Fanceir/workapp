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
import { SignInFlow } from "../types";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlertIcon } from"lucide-react";
interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError]=useState("");

  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    signIn("password", { email, password ,flow:"signIn"}).catch(() => {
        setError("登录失败，请检查您的邮箱和密码");
      }).finally(()=>{
        setPending(false);
      })
  }

  const onProviderSignIn = (value: "google" | "github") => {
    setPending(true); 
    signIn(value).finally(() => {
      setPending(false);
    });
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>登录以继续</CardTitle>
        <CardDescription>使用email或者其他服务以继续</CardDescription>
      </CardHeader>
      {!!error&&(
      <div className="bg-destructive/15 rounded-md flex p-3 items-center gap-x-2 text-sm text-destructive mb-6">
      <TriangleAlertIcon className="size-4" />
      <p>{error}</p>
      </div>
    )}


      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={onPasswordSignIn}>
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email/邮箱"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="密码"
            type="password"
            required
          />
          <Button type="submit" className="w-full" size="lg" disabled={false}>
            继续
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={false}
            onClick={() => {
              onProviderSignIn("google");
            }}
            variant={"outline"}
            size="lg"
            className="w-full"
          >
            <FcGoogle className="size-5 top-3 left-2.5" />
            使用google登录
          </Button>
          <Button
            disabled={pending}
            onClick={() => onProviderSignIn("github")}
            variant={"outline"}
            size="lg"
            className="w-full"
          >
            <FaGithub className="size-5 top-3 left-2.5" />
            使用Github登录
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          没有账号？
          <span
            onClick={() => setState("signUp")}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            注册一个
          </span>
        </p>
        <p className="text-xs text-muted-foreground">
          忘记密码了？
          <span
            onClick={() => setState("resetPassword")}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            重置密码
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
