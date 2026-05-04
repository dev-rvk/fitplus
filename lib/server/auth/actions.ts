"use server";

import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { createSession, clearSession } from "@/lib/server/auth/session";

export async function loginAction(data: { email: string; password: string }) {
  const { email, password } = data;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const user = await prisma.profile.findUnique({ where: { email } });
    if (!user) {
      return { error: "No account found with this email. Please check your email or register." };
    }

    const isValid = await compare(password, user.passwordHash);
    if (!isValid) {
      return { error: "Incorrect password. Please try again." };
    }

    await createSession(user.id);
    return { success: true };
  } catch (err) {
    console.error("[FitPlus] Login error:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error";
    return {
      error: `Login failed: ${message}. Please check that the database is running (bun run db:up).`,
    };
  }
}

export async function registerAction(data: { email: string; password: string; name: string }) {
  const { email, password, name } = data;

  if (!email || !password || !name) {
    return { error: "All fields (name, email, password) are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  try {
    const existingUser = await prisma.profile.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "An account with this email already exists. Try logging in instead." };
    }

    const passwordHash = await hash(password, 10);
    const user = await prisma.profile.create({
      data: { email, name, passwordHash },
    });

    await createSession(user.id);
    return { success: true };
  } catch (err) {
    console.error("[FitPlus] Registration error:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error";
    return {
      error: `Registration failed: ${message}. Please check that the database is running (bun run db:up) and migrations are applied (bun run prisma:migrate:dev).`,
    };
  }
}

export async function logoutAction() {
  await clearSession();
  return { success: true };
}
