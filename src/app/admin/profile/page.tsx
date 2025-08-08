import React from 'react';

// Dados fictícios do perfil do administrador para demonstração
const mockProfileData = {
  name: 'Administrador da Franquia',
  email: 'admin@franqup.com',
  memberSince: 'Janeiro de 2025',
};

export default function AdminProfilePage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Meu Perfil</h2>
      <p className="text-gray-400 mb-8">Informações da sua conta de administrador.</p>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0 w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            AD
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{mockProfileData.name}</h3>
            <p className="text-gray-400">{mockProfileData.email}</p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-300">Detalhes da Conta</h4>
            <ul className="mt-2 text-gray-400 space-y-2">
              <li className="flex justify-between items-center">
                <span>Membro desde:</span>
                <span className="text-white font-medium">{mockProfileData.memberSince}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Tipo de Acesso:</span>
                <span className="text-white font-medium">Administrador</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}