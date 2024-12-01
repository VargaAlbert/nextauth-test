import { MongoClient } from "mongodb";

// MongoDB URI (helyettesítsd a saját URL-t)
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"; // Cseréld ki, ha más a beállításod

const client = new MongoClient(MONGO_URI);

// MongoClient ígéret a típus megfelelő beállításához
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // A fejlesztési módban a MongoClient kapcsolódást nem hozunk létre azonnal
  // hogy elkerüljük a sok párhuzamos kapcsolatot (a Next.js gyors újratöltésével)
  clientPromise = client.connect().then((client) => {
    console.log("MongoDB kapcsolat sikeresen létrejött (fejlesztési mód).");
    return client; // Biztosítjuk, hogy a MongoClient-t visszaadjuk
  }).catch((err) => {
    console.error("Hiba történt a MongoDB kapcsolódásakor:", err);
    throw err; // Hibát dobunk, ha nem sikerült kapcsolódni
  });
} else {
  // A produkciós módban a MongoClient kapcsolat előre létrejön
  clientPromise = client.connect().then((client) => {
    console.log("MongoDB kapcsolat sikeresen létrejött (produkciós mód).");
    return client; // Biztosítjuk, hogy a MongoClient-t visszaadjuk
  }).catch((err) => {
    console.error("Hiba történt a MongoDB kapcsolódásakor:", err);
    throw err; // Hibát dobunk, ha nem sikerült kapcsolódni
  });
}

export default clientPromise;

