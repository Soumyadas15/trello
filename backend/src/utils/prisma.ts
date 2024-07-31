import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv";

dotenv.config();

declare global{
    var prisma: PrismaClient | undefined;
}

export const prisma = new PrismaClient();

globalThis.prisma = prisma;