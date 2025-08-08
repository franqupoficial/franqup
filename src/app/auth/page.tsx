'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
    
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || 'Erro ao fazer login.');
                return;
            }

            // A requisição foi bem-sucedida, vamos redirecionar o usuário
            // O middleware irá interceptar esta requisição e enviá-lo para a página correta
            router.push('/franquedo');

        } catch (err) {
            console.error(err);
            setError('Ocorreu um erro durante o login.');
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="p-8 bg-gray-800 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>
                <form onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                            E-mail
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                            Senha
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 bg-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                            type="submit"
                        >
                            Entrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}