"use client"; 

import { useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client'; 
import { useRouter } from 'next/navigation';

export default function ConnexionPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const supabase = createSupabaseClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Incorrect email or password.");
    } else {
      router.push('/admin'); 
      router.refresh();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleLogin} 
        className="p-8 bg-white shadow-md rounded-lg w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-[#2c4b3a]">
          Admin Login
        </h1>
        
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#467A5E] focus:border-[#467A5E]"
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700" htmlFor="password">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#467A5E] focus:border-[#467A5E]"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        
        <button 
          type="submit" 
          className="w-full bg-[#467A5E] text-white p-3 rounded-lg font-semibold hover:bg-[#346048] transition-colors"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}