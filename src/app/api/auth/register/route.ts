// /pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import clientPromise from "../../../../../service/mongodb";

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const client = await clientPromise;
  const db = client.db("authTest");

  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already in use" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const verificationToken = uuidv4();

  const newUser = {
    email,
    password: hashedPassword,
    isVerified: false,
    verificationToken,
    createdAt: new Date(),
  };

  await db.collection("users").insertOne(newUser);

  const verificationLink = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `<p>Please click the following link to verify your email: <a href="${verificationLink}">Verify Email</a></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
      return res.status(500).json({ error: "Error sending verification email" });
    }
    res.status(200).json({ message: "Registration successful. Please check your email to verify your account." });
  });
}
