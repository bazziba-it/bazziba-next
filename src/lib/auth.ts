/**
 * Bazziba Next.js - Auth Configuration (NextAuth.js v4)
 * Lazy initialization to prevent build-time errors.
 */
import type { NextAuthOptions } from "next-auth";

export const authConfig: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "dev-secret",
  providers: [],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        // ignore invalid URLs
      }
      return baseUrl;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export { authConfig as default };
