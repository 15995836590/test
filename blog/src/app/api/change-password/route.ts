import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { oldPassword, newPassword } = await request.json();

  if (!oldPassword || !newPassword) {
    return NextResponse.json({ error: "请填写完整" }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: "新密码至少6位" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: (session.user as Record<string, unknown>).email as string },
  });

  if (!user) return NextResponse.json({ error: "用户不存在" }, { status: 404 });

  const isValid = await bcrypt.compare(oldPassword, user.password);
  if (!isValid) return NextResponse.json({ error: "旧密码不正确" }, { status: 400 });

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

  return NextResponse.json({ message: "密码修改成功" });
}
