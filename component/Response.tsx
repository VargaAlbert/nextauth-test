"use client"

import { useEffect, useState } from "react";
import clientPromise from "../service/mongodb";

const Response = () => {
  const [data, setData] = useState<any>(null); // Állapot tárolása az adatnak
  const [error, setError] = useState<string | null>(null); // Hibák tárolása

  useEffect(() => {
    const fetchData = async () => {
      try {
        // A MongoDB kapcsolat létrehozása és a kívánt adat lekérése
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection("yourCollection"); // Cseréld le a saját gyűjteményedre
        const result = await collection.findOne({}); // Példa adatlekérés
        setData(result); // Az adatot elmentjük az állapotba
      } catch (err) {
        setError("Hiba történt az adatlekérés során");
        console.error(err); // Hibák naplózása
      }
    };

    fetchData();
  }, []); // Csak egyszer fut le a komponens betöltődésekor

  // Ha az adatokat sikerült lekérni, megjelenítjük őket
  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <h1>MongoDB Adatok:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}

export default Response;