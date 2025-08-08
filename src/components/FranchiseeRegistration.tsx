// src/components/FranchiseDashboard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function FranchiseDashboard() {
  const [clientName, setClientName] = useState('');
  const [clientCpf, setClientCpf] = useState('');
  const [cnhSituation, setCnhSituation] = useState('');
  const [cnhFile, setCnhFile] = useState<File | null>(null);
  const [addressProofFile, setAddressProofFile] = useState<File | null>(null);
  const [serviceType, setServiceType] = useState('cnh');
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [formDisabled, setFormDisabled] = useState(false);

  // Firebase configuration and app ID from the canvas environment
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  // Initialize Firebase services
  const app = firebaseConfig ? initializeApp(firebaseConfig) : null;
  const db = app ? getFirestore(app) : null;

  // Function to convert a file to a Base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to clear the form fields
  const clearForm = () => {
    setClientName('');
    setClientCpf('');
    setCnhSituation('');
    setCnhFile(null);
    setAddressProofFile(null);
    setSubmissionStatus('');
    setFormDisabled(false);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!db) {
      setSubmissionStatus('Erro: Banco de dados não inicializado.');
      return;
    }

    if (!cnhFile || !addressProofFile) {
      setSubmissionStatus('Erro: Por favor, anexe a CNH e o comprovante de endereço.');
      return;
    }

    setFormDisabled(true);
    setSubmissionStatus('Enviando...');

    try {
      // Convert files to Base64
      const cnhFileData = await fileToBase64(cnhFile);
      const addressProofFileData = await fileToBase64(addressProofFile);
      
      // Add the document to the 'requests' collection in Firestore
      await addDoc(collection(db, `/artifacts/${appId}/public/data/requests`), {
        serviceType,
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
        timestamp: serverTimestamp(),
      });

      setSubmissionStatus('Solicitação enviada com sucesso!');
      clearForm(); // Clear the form on successful submission
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
      setSubmissionStatus('Erro ao enviar solicitação.');
    } finally {
      setFormDisabled(false);
      setTimeout(() => {
        setSubmissionStatus('');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 font-sans">
      <header className="flex justify-between items-center py-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">FranqUp</h1>
        <a href="/admin" className="px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-700 transition-colors">
          Ver Dashboard do Admin
        </a>
      </header>

      <div className="flex flex-col items-center justify-center pt-16">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Painel do Franqueado</h2>
            <button
              onClick={() => {}} // Placeholder for "Dashboard do Admin" button logic
              className="px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Dashboard do Admin
            </button>
          </div>

          <div className="flex mb-6 space-x-2">
            <button
              onClick={() => setServiceType('cnh')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                serviceType === 'cnh' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-700'
              }`}
            >
              CNH
            </button>
            <button
              onClick={clearForm}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-gray-400 hover:bg-gray-700 transition-colors"
            >
              Limpa Nome
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-300">Nome Completo</label>
              <input
                type="text"
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={formDisabled}
              />
            </div>

            <div>
              <label htmlFor="clientCpf" className="block text-sm font-medium text-gray-300">CPF</label>
              <input
                type="text"
                id="clientCpf"
                value={clientCpf}
                onChange={(e) => setClientCpf(e.target.value)}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={formDisabled}
              />
            </div>

            <div>
              <label htmlFor="cnhSituation" className="block text-sm font-medium text-gray-300">Situação da CNH</label>
              <select
                id="cnhSituation"
                value={cnhSituation}
                onChange={(e) => setCnhSituation(e.target.value)}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={formDisabled}
              >
                <option value="">Selecione uma opção</option>
                <option value="ativa">Ativa</option>
                <option value="suspensa">Suspensa</option>
                <option value="cassada">Cassada</option>
              </select>
            </div>
            
            {/* Campo de upload da CNH com estilo básico para garantir visibilidade */}
            <div>
              <label htmlFor="cnhFile" className="block text-sm font-medium text-gray-300">Anexo CNH</label>
              <input
                type="file"
                id="cnhFile"
                onChange={(e) => setCnhFile(e.target.files ? e.target.files[0] : null)}
                className="mt-1 block w-full text-sm text-gray-400 bg-gray-700 border border-gray-600 rounded-md p-2"
                required
                disabled={formDisabled}
              />
              <span className="text-gray-400 text-sm mt-1 block">
                {cnhFile ? `Arquivo selecionado: ${cnhFile.name}` : 'Nenhum arquivo selecionado.'}
              </span>
            </div>

            {/* Campo de upload do Comprovante de Endereço com estilo básico para garantir visibilidade */}
            <div>
              <label htmlFor="addressProofFile" className="block text-sm font-medium text-gray-300">Anexo Comprovante de Endereço</label>
              <input
                type="file"
                id="addressProofFile"
                onChange={(e) => setAddressProofFile(e.target.files ? e.target.files[0] : null)}
                className="mt-1 block w-full text-sm text-gray-400 bg-gray-700 border border-gray-600 rounded-md p-2"
                required
                disabled={formDisabled}
              />
              <span className="text-gray-400 text-sm mt-1 block">
                {addressProofFile ? `Arquivo selecionado: ${addressProofFile.name}` : 'Nenhum arquivo selecionado.'}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-500"
              disabled={formDisabled}
            >
              Enviar Solicitação
            </button>
            
            {submissionStatus && (
              <p className={`mt-4 text-center font-bold ${
                submissionStatus.includes('sucesso') ? 'text-green-400' : 'text-red-400'
              }`}>
                {submissionStatus}
              </p>
            )}
          </form>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-gray-900 border-t border-gray-700">
        <div className="flex items-center space-x-2 text-red-400">
          <span className="font-bold">N</span> 3 Issues
        </div>
        <button className="px-4 py-2 bg-green-600 rounded-lg text-white font-bold hover:bg-green-700 transition-colors">
          Suporte
        </button>
      </footer>
    </div>
  );
}
