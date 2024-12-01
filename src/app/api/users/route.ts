import { NextResponse } from "next/server";
import clientPromise from "../../../../service/mongodb";

import { NextApiRequest, NextApiResponse } from "next";

// app/api/users/route.ts

/* const users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

export async function GET() {
  return NextResponse.json(users);
} */

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("authTest");
    const collection = db.collection("users");

    // Adatok lekérése a "users" gyűjteményből
    const users = await collection.find({}).toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
