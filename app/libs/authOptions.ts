import { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log(url);
      console.log(baseUrl);
      return "/forms";
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        if (account.refresh_token) token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      if (token.refresh_token) session.refreshToken = token.refreshToken;
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      checks: "none",
      // authorizationUrl:
      //   "https://accounts.google.com/o/oauth2/v2/auth?hd=company.com",
      authorization: {
        params: {
          scope: "openid email https://www.googleapis.com/auth/drive",
        },
      },
    }),
  ],
  // theme: {
  //   colorScheme: "light",
  // },
};
