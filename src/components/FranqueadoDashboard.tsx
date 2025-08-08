// src/components/FranqueadoDashboard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth'; // Importado para manter a autenticação

// Interfaces para os estados dos formulários
interface CnhFormState {
  clientName: string;
  clientCpf: string;
  cnhSituation: 'Suspensa' | 'Cassada' | 'Bloqueada' | '';
  cnhFile: File | null;
  addressProofFile: File | null;
}

interface LimpaNomeFormState {
  clientName: string;
  clientCpf: string;
  // Outros campos para Limpa Nome, se houver
}

export function FranqueadoDashboard({ onSwitchToAdmin }: { onSwitchToAdmin: () => void }) {
  const router = useRouter();

  // Estados principais
  const [activeForm, setActiveForm] = useState<'cnh' | 'limpaNome'>('cnh');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Estados dos formulários específicos
  const [cnhFormData, setCnhFormData] = useState<CnhFormState>({
    clientName: '',
    clientCpf: '',
    cnhSituation: '',
    cnhFile: null,
    addressProofFile: null,
  });
  const [limpaNomeFormData, setLimpaNomeFormData] = useState<LimpaNomeFormState>({
    clientName: '',
    clientCpf: '',
  });

  // Configuração e inicialização do Firebase
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  const app = firebaseConfig ? initializeApp(firebaseConfig) : null;
  const db = app ? getFirestore(app) : null;

  // Efeito para autenticação anônima do Firebase
  useEffect(() => {
    const initFirebase = async () => {
      try {
        if (app) {
          const auth = getAuth(app);
          await signInAnonymously(auth);
          console.log("Firebase Auth iniciado com sucesso.");
        } else {
          console.error("Configurações do Firebase não encontradas.");
        }
      } catch (error) {
        console.error("Erro na inicialização do Firebase Auth:", error);
      }
    };
    initFirebase();
  }, [app]);

  // Handler para converter arquivo para Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handlers para os inputs dos formulários
  const handleCnhInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCnhFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCnhFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setCnhFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleLimpaNomeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLimpaNomeFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler para o envio dos formulários
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    if (!db) {
      setMessage('Erro: Banco de dados não inicializado.');
      setIsError(true);
      setLoading(false);
      return;
    }

    let payload = {};
    let serviceType = '';

    if (activeForm === 'cnh') {
      const { clientName, clientCpf, cnhSituation, cnhFile, addressProofFile } = cnhFormData;
      if (!cnhFile || !addressProofFile) {
        setMessage('Por favor, anexe a CNH e o comprovante de endereço.');
        setIsError(true);
        setLoading(false);
        return;
      }

      const cnhFileData = await fileToBase64(cnhFile);
      const addressProofFileData = await fileToBase64(addressProofFile);
      
      payload = {
        clientName,
        clientCpf,
        cnhSituation,
        cnhAttachment: {
          fileName: cnhFile.name,
          fileType: cnhFile.type,
          data: cnhFileData,
        },
        addressProofAttachment: {
          fileName: addressProofFile.name,
          fileType: addressProofFile.type,
          data: addressProofFileData,
        },
      };
      serviceType = 'cnh';
    } else {
      payload = { ...limpaNomeFormData };
      serviceType = 'limpa-nome';
    }

    try {
      // Adiciona o documento no Firestore
      await addDoc(collection(db, `/artifacts/${appId}/public/data/requests`), {
        ...payload,
        serviceType,
        timestamp: serverTimestamp(),
      });
      
      setMessage('Solicitação enviada com sucesso! Redirecionando para a página de pagamento.');
      setIsError(false);
      
      // Redireciona para a página de pagamento após 2 segundos
      setTimeout(() => {
        router.push('/payment');
      }, 2000);

    } catch (error: any) {
      console.error("Erro ao adicionar documento: ", error);
      setMessage('Erro ao enviar solicitação.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const renderCnhForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campos de texto e select existentes */}
      <div>
        <label htmlFor="clientName" className="block text-sm font-medium text-gray-300">
          Nome Completo
        </label>
        <input
          type="text"
          id="clientName"
          name="clientName"
          value={cnhFormData.clientName}
          onChange={handleCnhInputChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="clientCpf" className="block text-sm font-medium text-gray-300">
          CPF
        </label>
        <input
          type="text"
          id="clientCpf"
          name="clientCpf"
          value={cnhFormData.clientCpf}
          onChange={handleCnhInputChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="cnhSituation" className="block text-sm font-medium text-gray-300">
          Situação da CNH
        </label>
        <select
          id="cnhSituation"
          name="cnhSituation"
          value={cnhFormData.cnhSituation}
          onChange={handleCnhInputChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Selecione uma opção</option>
          <option value="Suspensa">Suspensa</option>
          <option value="Cassada">Cassada</option>
          <option value="Bloqueada">Bloqueada</option>
        </select>
      </div>

      {/* Campos de upload de arquivos */}
      <div>
        <label htmlFor="cnhFile" className="block text-sm font-medium text-gray-300">
          Anexo CNH
        </label>
        <input
          type="file"
          id="cnhFile"
          name="cnhFile"
          onChange={handleCnhFileChange}
          required
          className="mt-1 block w-full text-sm text-gray-400 bg-gray-700 border border-gray-600 rounded-md p-2"
        />
        <span className="text-gray-400 text-sm mt-1 block">
          {cnhFormData.cnhFile ? `Arquivo selecionado: ${cnhFormData.cnhFile.name}` : 'Nenhum arquivo selecionado.'}
        </span>
      </div>

      <div>
        <label htmlFor="addressProofFile" className="block text-sm font-medium text-gray-300">
          Anexo Comprovante de Endereço
        </label>
        <input
          type="file"
          id="addressProofFile"
          name="addressProofFile"
          onChange={handleCnhFileChange}
          required
          className="mt-1 block w-full text-sm text-gray-400 bg-gray-700 border border-gray-600 rounded-md p-2"
        />
        <span className="text-gray-400 text-sm mt-1 block">
          {cnhFormData.addressProofFile ? `Arquivo selecionado: ${cnhFormData.addressProofFile.name}` : 'Nenhum arquivo selecionado.'}
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}
      >
        {loading ? 'Enviando...' : 'Enviar Solicitação'}
      </button>
    </form>
  );

  const renderLimpaNomeForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campos do formulário Limpa Nome */}
      <div>
        <label htmlFor="clientName" className="block text-sm font-medium text-gray-300">
          Nome Completo
        </label>
        <input
          type="text"
          id="clientName"
          name="clientName"
          value={limpaNomeFormData.clientName}
          onChange={handleLimpaNomeInputChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="clientCpf" className="block text-sm font-medium text-gray-300">
          CPF
        </label>
        <input
          type="text"
          id="clientCpf"
          name="clientCpf"
          value={limpaNomeFormData.clientCpf}
          onChange={handleLimpaNomeInputChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}
      >
        {loading ? 'Enviando...' : 'Enviar Solicitação'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4 text-white">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-white">
            Painel do Franqueado
          </h1>
          <button
            onClick={onSwitchToAdmin}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Dashboard do Admin
          </button>
        </div>

        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveForm('cnh')}
            className={`flex-1 py-3 px-4 text-center font-semibold rounded-t-md transition-all ${activeForm === 'cnh' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          >
            CNH
          </button>
          <button
            onClick={() => setActiveForm('limpaNome')}
            className={`flex-1 py-3 px-4 text-center font-semibold rounded-t-md transition-all ${activeForm === 'limpaNome' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          >
            Limpa Nome
          </button>
        </div>

        <div>
          {activeForm === 'cnh' ? renderCnhForm() : renderLimpaNomeForm()}
        </div>

        {message && (
          <div
            className={`mt-6 p-4 rounded-md text-center font-semibold ${isError ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}