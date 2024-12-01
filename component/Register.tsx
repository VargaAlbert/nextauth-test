import Link from 'next/link';
import { useState } from 'react';

//varga.albert@gmail.com
export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        const errorData = await response.text(); // Ha nem JSON, próbálj sima szöveges választ kérni
        throw new Error(`Hiba történt: ${errorData}`);
      }
  
      const data = await response.json(); // Csak akkor próbáld meg a JSON-t, ha a válasz sikeres
      if (data.message) {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Hiba:', error);
      setError('Hiba történt a regisztráció során.');
    }
  };

  return (
    <main className="h-screen bg-black flex justify-center items-center">
      <section className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 text-white">
        <h1 className="text-center text-xl mb-4">Regisztráció</h1>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border-2 text-black border-gray-600 rounded-lg"
        />
        <input
          type="password"
          placeholder="Jelszó"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border-2 text-black border-gray-600 rounded-lg"
        />
        <button
          onClick={handleRegister}
          className="w-full py-2 bg-blue-600 text-white rounded-lg"
        >
          Regisztráció
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {message && <p className="text-green-500 mt-2">{message}</p>}

        <div className="mt-4 text-center">
            <span className="text-gray-400">
              Már van fiókod ?{' '}
              <Link href="/">
                <p className="text-blue-500 hover:underline">Belépés itt</p>
              </Link>
            </span>
          </div>
          
      </section>
    </main>
  );
}
