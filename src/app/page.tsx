"use client";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

export default function Home(){
  const {signOut} = useAuthActions()
  return (
    <div>
      <h1>已成功登陆</h1>
      <Button onClick={()=>signOut()}>登出</Button>
    </div>  
  )
}