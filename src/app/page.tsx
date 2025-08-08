import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <h1 className="text-5xl font-bold mb-8 text-center">Bem-vindo(a)</h1>
      <p className="text-xl mb-12 text-center max-w-2xl">
        Por favor, escolha sua área para fazer o login.
      </p>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
        <Link href="/auth">
          <p className="bg-purple-600 text-white font-semibold py-4 px-10 rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 transform hover:scale-105 text-center">
            Login Franqueado
          </p>
        </Link>
        <Link href="/auth">
          <p className="bg-blue-600 text-white font-semibold py-4 px-10 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 text-center">
            Login Admin
          </p>
        </Link>
      </div>
    </div>
  );
}