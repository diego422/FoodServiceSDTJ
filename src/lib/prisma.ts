/**
 * prisma.ts
 *
 * This file creates and exports a single Prisma Client instance
 * to be reused throughout the application.
 *
 * Why?
 * - Avoids creating a new database connection on every request,
 *   which is especially important in environments like Next.js
 *   where code can run on the server multiple times.
 * - Provides a centralized way to import Prisma anywhere in the app.
 */

import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export default prisma;