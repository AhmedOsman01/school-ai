import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import type { UserRole } from "@/types";

declare module "next-auth" {
  interface User {
    role: UserRole;
    personId?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: UserRole;
      personId?: string;
    };
  }
}

declare module "next-auth" {
  interface JWT {
    role: UserRole;
    personId?: string;
  }
}

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({
          email: credentials.email as string,
          isActive: true,
        }).select("+passwordHash");

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) {
          return null;
        }

        // Update last login
        await User.updateOne(
          { _id: user._id },
          { lastLogin: new Date() }
        );

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          personId: user.person?._id?.toString() || user.person?.toString(),
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.personId = user.personId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as UserRole;
        session.user.personId = token.personId as string | undefined;
      }
      return session;
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
      const isOnApi = request.nextUrl.pathname.startsWith("/api");
      const isOnWebhook = request.nextUrl.pathname.startsWith("/api/webhooks");

      // Allow webhook endpoints without auth
      if (isOnWebhook) return true;

      // Protect dashboard routes
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }

      // Protect API routes (except auth routes)
      if (isOnApi && !request.nextUrl.pathname.startsWith("/api/auth")) {
        return isLoggedIn;
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.AUTH_SECRET,
});
