import axios from "axios";
import { profile } from "console";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { signIn } from "next-auth/react";
import { cookies } from "next/headers";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    signIn: async ({ profile, account, user }: any) => {
      user.accessToken = account.id_token;
      await axios.post(
        `${process.env.API_BASE_URL}/api/v1/users/login`,
        {
          email: profile["email"],
        },
        {
          headers: {
            "x-auth-key": account.id_token,
          },
        }
      );
      return true;
    },
    jwt: async ({ token, user }: any) => {
      if (user) {
        token = { accessToken: user.accessToken };
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      session.accessToken = token.accessToken;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const getAuth = () => getServerSession(authOptions as any);

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };
