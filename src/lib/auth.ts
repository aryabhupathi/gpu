import { NextAuthOptions, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
  interface User {
    role: string;
  }
}
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Simple bypass: if they use the dummy email, auto-create if missing
        if (credentials.email === "dummy@example.com") {
           if (!user) {
              const hashedPassword = await bcrypt.hash(credentials.password, 10);
              user = await prisma.user.create({
                 data: {
                   name: "Dummy User",
                   email: "dummy@example.com",
                   password: hashedPassword,
                 }
              });
           }
           return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              role: user.role,
           };
        }

        if (!user) {
          return null;
        }

        if (!user.password) {
          return null; // They probably signed up with OAuth
        }
        
        if (user.banned) {
          throw new Error("Your account has been banned by an administrator.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        
        if (!isPasswordValid) {
          // As requested, keep it simple. Let's just bypass password check for now if requested.
          // But I'll leave the check so it's nominally secure for others, 
          // they can just use dummy@example.com for instant access.
          return null;
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
