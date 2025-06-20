import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          return null; // Return null instead of throwing an error
        }

        // Verify password
        const isValid = verifyPassword(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          return null; // Return null instead of throwing an error
        }

        // Return user object without password
        return {
          id: user.id.toString(), // Ensure ID is a string
          name: user.name,
          email: user.email,
          image: user.avatarUrl,
        }; // Cast to User type
      },
    }),
  ],
  // pages: {
  //   signIn: "/login", // Customize this to your login page path
  // },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.image = user.image;
      }
      if (trigger === "update" && session?.user) {
        token.image = session.user.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.image = token.image as string;
      }
      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  trustHost: true,
});
