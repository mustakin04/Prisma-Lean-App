import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";


import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PAS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
     try {
 const info = await transporter.sendMail({
  from: '"Prisma App" <no-reply@prisma.com>',
  to: user.email,
  subject: "Verify Your Email Address",
  html: `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

      <h2 style="color:#333;">🔐 Verify Your Email</h2>

      <p style="font-size:16px; color:#555;">
        Hi <b>${user.name || "User"}</b>,  
        please verify your email address to activate your account.
      </p>

      <p style="font-size:15px; color:#666;">
        Click the button below to verify your email:
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a href="${url}" 
           style="background:#4f46e5; color:white; padding:12px 24px; text-decoration:none; border-radius:8px; font-weight:bold;">
          Verify Email
        </a>
      </div>

      <p style="font-size:13px; color:#888;">
        If the button doesn’t work, copy and paste this link:
      </p>

      <p style="font-size:12px; word-break:break-all; color:#4f46e5;">
        ${url}
      </p>

      <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />

      <p style="font-size:12px; color:#aaa; text-align:center;">
        © ${new Date().getFullYear()} Prisma App. All rights reserved.
      </p>

    </div>
  </div>
  `,
});
console.log("USER:", process.env.SMTP_USER);
console.log("PASS:", process.env.SMTP_PASS);
  console.log("Message sent: %s", info.messageId);
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
  console.error("Error while sending mail:", err);
}
    },
  },
});
