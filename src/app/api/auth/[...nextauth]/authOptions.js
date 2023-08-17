import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import NetlifyProvider from "next-auth/providers/netlify";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { firestore } from "../../../firebase/firestore";

const callbacks = {
  // async signIn({ user, account, profile, email, credentials }) {
  //   return true;
  // },
  async redirect({ url, baseUrl }) {
    return baseUrl;
  },
  async session({ session, user, token }) {
    session.user.provider = token.provider;
    session.user.accessToken = token.accessToken;
    return session;
  },
  async jwt({ token, user, account, trigger, session }) {
    if (user) {
      token = { provider: account.provider, accessToken: account.access_token, ...token };
    }
    if (trigger === "update") {
      return { ...token, ...session.user };
    }
    return { ...token, ...user };
  },
};

export const authOptions = {
  // secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  jwt: {
    maxAge: 60 * 60 * 24 * 2,
  },
  adapter: FirestoreAdapter({
    ...firestore,
    // namingStrategy: "snake_case",
  }),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username:",
          type: "text",
          placeholder: "your-cool-username",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "your-awesome-password",
        },
      },
      async authorize(credentials) {
        // This is where you need to retrieve user data
        // to verify with credentials
        // Docs: https://next-auth.js.org/configuration/providers/credentials
        const user = { id: "42", name: "admin", password: "admin" };

        if (credentials?.username === user.name && credentials?.password === user.password) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks,
};
