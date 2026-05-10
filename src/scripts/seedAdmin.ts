import "dotenv/config";

import { prisma } from "../lib/prisma";
import http from "http";
import { UserRole } from "../middlewares/auth";

const httpPost = (url: string, data: object): Promise<any> => {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: "localhost",
      port: 6000,
      path: "/api/auth/sign-up/email",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
};

const seedAdmin = async () => {
  try {
    const adminData = {
      name: "Admin1",
      email: "admin1@gmail.com",
      password: "admin@123",
      role: UserRole.ADMIN,
    };

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingAdmin) {
      console.log("Admin already registered");
      process.exit(0);
    }

    console.log("Signing up admin...");
    const result = await httpPost("http://localhost:6000/api/auth/sign-up/email", {
      name: adminData.name,
      email: adminData.email,
      password: adminData.password,
    });

    console.log("Sign up result:", result);

    if (result.user?.id) {
      await prisma.user.update({
        where: { id: result.user.id },
        data: { role: UserRole.ADMIN },
      });
      console.log("✅ Admin seeded successfully!");
    } else {
      console.log("❌ Sign up failed:", result);
    }

  } catch (error) {
    console.log("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seedAdmin();