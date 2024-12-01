import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import clientPromise from "../../../../../service/mongodb";
import { MongoClient } from "mongodb";
import { Session } from "next-auth";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          console.log("Hiányzó hitelesítő adatok");
          throw new Error("Hiányzó hitelesítő adatok");
        }

        try {
          const client: MongoClient = await clientPromise;
          const db = client.db("authTest"); // Az adatbázis neve

          console.log(
            "Keresés az adatbázisban email alapján:",
            credentials.email
          );
          const user = await db
            .collection("users")
            .findOne({ email: credentials.email });

          if (!user) {
            console.log(
              "Nem található felhasználó ezzel az e-mail címmel:",
              credentials.email
            );
            throw new Error(
              "Nem található felhasználó ezzel az e-mail címmel."
            );
          }

          console.log("Felhasználó megtalálva:", user);
          console.log("credentials.password:", credentials.password )

          const isValidPassword: boolean = await bcrypt.compare(
            credentials.password,
            user.password
          ); 
          
          console.log("isValidPassword:", isValidPassword)

          if (!isValidPassword) {
            console.log(
              "Helytelen jelszó próbálkozás a felhasználónál:",
              credentials.email
            );
            throw new Error("Helytelen jelszó.");
          }

          // Sikeres autentikáció esetén visszaadjuk a felhasználót
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.email,
          };
        } catch (error) {
          console.error("Hiba az autentikáció során:", error);
          throw new Error("Hiba történt az autentikáció során");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 1 * 1 * 60 * 60, //  egy óra (másodpercben)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
