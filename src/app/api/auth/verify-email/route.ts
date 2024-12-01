import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import clientPromise from "../../../../../service/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Missing verification token" });
  }

  const client = await clientPromise;
  const db = client.db("authTest");

  const user = await db.collection("users").findOne({ verificationToken: token });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  await db.collection("users").updateOne(
    { verificationToken: token },
    { $set: { isVerified: true, verificationToken: null } }
  );

  res.status(200).json({ message: "Email verified successfully" });
}