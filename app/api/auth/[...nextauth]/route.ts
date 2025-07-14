import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("Sign in callback:", user);
      try {
        await prisma.user.create({
          data: {
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
  },
});

export { handler as GET, handler as POST };
