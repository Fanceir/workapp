// ResendOTPPasswordReset.ts
import { Email } from "@convex-dev/auth/providers/Email";
import { alphabet, generateRandomString } from "oslo/crypto";
import { Resend } from "resend";

export const ResendOTPPasswordReset = Email({
  id: "resend-otp-password-reset",
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    return generateRandomString(8, alphabet("0-9")); // 8位数字验证码
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new Resend(provider.apiKey);
    const { error } = await resend.emails.send({
      from: process.env.AUTH_EMAIL ?? "My App <onboarding@resend.dev>",
      to: [email],
      subject: "重置密码验证码",
      text: `您的重置密码验证码是：${token}`,
    });

    if (error) throw new Error(JSON.stringify(error));
  },
});