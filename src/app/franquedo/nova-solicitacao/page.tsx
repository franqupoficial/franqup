import Link from 'next/link';
import { FaCar, FaUser, FaMoneyBill, FaShieldAlt } from 'react-icons/fa';

export default function NovaSolicitacaoPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Nova Solicitação</h1>
      <p className="text-lg text-gray-400">Escolha o tipo de serviço para iniciar um novo processo.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card para CNH */}
        <Link href="/franquedo/nova-solicitacao/cnh">
          <p className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors cursor-pointer flex flex-col items-center text-center">
            <FaCar className="text-purple-400 text-5xl mb-4" />
            <h2 className="text-2xl font-semibold">CNH</h2>
            <p className="text-gray-400">Opção Suspensa ou Cassada</p>
          </p>
        </Link>

        {/* Card para Limpa Nome */}
        <Link href="/franquedo/nova-solicitacao/limpa-nome">
          <p className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors cursor-pointer flex flex-col items-center text-center">
            <FaUser className="text-green-400 text-5xl mb-4" />
            <h2 className="text-2xl font-semibold">Limpa Nome</h2>
            <p className="text-gray-400">Regularização de CPF</p>
          </p>
        </Link>
        
        {/* Card para Consórcio (não funcional ainda) */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg opacity-50 cursor-not-allowed flex flex-col items-center text-center">
          <FaMoneyBill className="text-yellow-400 text-5xl mb-4" />
          <h2 className="text-2xl font-semibold">Consórcio</h2>
          <p className="text-gray-400">(Em breve)</p>
        </div>

        {/* Card para Seguro (não funcional ainda) */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg opacity-50 cursor-not-allowed flex flex-col items-center text-center">
          <FaShieldAlt className="text-red-400 text-5xl mb-4" />
          <h2 className="text-2xl font-semibold">Seguro</h2>
          <p className="text-gray-400">(Em breve)</p>
        </div>
      </div>
    </div>
  );
}