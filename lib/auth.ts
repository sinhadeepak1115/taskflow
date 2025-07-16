import type { Session } from "next-auth";
type NextAuthOptions = any;
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: any }) {
      console.log("Sign in callback:", user);
      try {
        await prisma.user.upsert({
          where: { email: user.email || "" },
          update: {
            name: user.name || "",
            image: user.image || "",
          },
          create: {
            email: user.email || "",
            name: user.name || "",
            image: user.image || "",
          },
        });
      } catch (error) {
        console.error("Error in signIn callback:", error);
      }
      return true;
    },
    async session({ session }: { session: Session }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (dbUser) {
          session.user.id = dbUser.id;
        }
      }
      return session;
    },
  },
};
