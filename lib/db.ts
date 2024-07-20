import { PrismaClient } from "@prisma/client";

declare global {
  // have to use var to force initialize before other variables
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
