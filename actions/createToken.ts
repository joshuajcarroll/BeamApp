"use server";

import serverClient from "@/lib/streamServer";

export async function createToken(userId: string) {
  const token = await serverClient.createToken(userId);
  console.log("Creating token for user:", userId);
  return token;
}
