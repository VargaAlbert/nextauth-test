import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Ellenőrizzük, hogy mindkét mező meg van adva
    if (!email || !password) {
      return NextResponse.json({ error: 'Hiányzó e-mail vagy jelszó' }, { status: 400 });
    }

    // Csatlakozunk az adatbázishoz
    const client = new MongoClient(process.env.MONGODB_URI as string);

    await client.connect();
    const db = client.db('authTest'); // Használj megfelelő adatbázist
    const usersCollection = db.collection('users');

    // Ellenőrizzük, hogy létezik-e már felhasználó ezzel az e-mail címmel
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Felhasználó már létezik.' }, { status: 400 });
    }

    // A jelszó hashelése
    const hashedPassword = await bcrypt.hash(password, 10);

    // Új felhasználó létrehozása és mentése az adatbázisba
    const newUser = {
      email,
      password: hashedPassword, // Tároljuk a hashelt jelszót
    };

    await usersCollection.insertOne(newUser);

    return NextResponse.json({ message: 'Felhasználó sikeresen regisztrálva!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Hiba történt a regisztráció során' }, { status: 500 });
  }
}