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
interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>注册以继续</CardTitle>
        <CardDescription>使用email或者其他服务登录以继续</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input
            disabled={false}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email/邮箱"
            type="email"
            required
          />
          <Input
            disabled={false}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="密码"
            type="password"
            required
          />{" "}
          <Input
            disabled={false}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            placeholder="重复密码"
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
            onClick={() => {}}
            variant={"outline"}
            size="lg"
            className="w-full"
          >
            <FcGoogle className="size-5 top-3 left-2.5" />
            使用google登录
          </Button>
          <Button
            disabled={false}
            onClick={() => {}}
            variant={"outline"}
            size="lg"
            className="w-full"
          >
            <FaGithub className="size-5 top-3 left-2.5" />
            使用Github登录
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          已经有了一个账号？
          <span
            onClick={() => setState("signIn")}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            立即登录
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
