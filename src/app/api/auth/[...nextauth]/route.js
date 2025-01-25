import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "../../../../../firebase";
import { query, collection, where, getDocs } from "firebase/firestore";

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        // Query Firestore for a user with the provided email
        const q = query(
          collection(db, "users"),
          where("email", "==", credentials.email)
        );
        const docs = await getDocs(q);

        if (docs.empty) {
          throw new Error("No user found with this email");
        }

        const userDoc = docs.docs[0].data(); // Get user data
        const user = {
          id: docs.docs[0].id,
          email: userDoc.email,
          username: userDoc.username,
          randomImage: userDoc.randomImage,
          timeOfJoining: userDoc.timeOfJoining,
        };

        return user; // Return the full user object with timestamp
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.randomImage = user.randomImage;
        token.timeOfJoining = user.timeOfJoining;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.username = token.username;
      session.user.randomImage = token.randomImage;
      session.user.timeOfJoining = token.timeOfJoining;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
};

export const GET = (req, res) => NextAuth(req, res, authOptions);
export const POST = (req, res) => NextAuth(req, res, authOptions);
