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
    async signIn(params) {
      console.log("Sign in callback:", params);
      try {
        await prisma.user.create({
          data: {
            email: params.user.email || "",
            name: params.user.name || "",
            image: params.user.image || "",
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
