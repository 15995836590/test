import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const user = await prisma.user.findUnique({ where: { email: "admin@blog.com" } });
    if (!user) {
      return NextResponse.json({ error: "User not found in database" });
    }
    const isValid = await bcrypt.compare("admin123", user.password);
    return NextResponse.json({
      userExists: true,
      userName: user.name,
      passwordValid: isValid,
      passwordHash: user.password.slice(0, 20) + "...",
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
