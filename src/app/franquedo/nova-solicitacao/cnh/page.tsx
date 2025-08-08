'use client';

import { handleSubmitCnhForm } from './actions';
import React from 'react';

export default function CnhFormPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">CNH Suspensa ou Cassada</h1>
      <p className="text-lg text-gray-400">Preencha os dados e anexe os documentos para iniciar o processo.</p>

      <form action={handleSubmitCnhForm} className="space-y-6">
        <div>
          <label htmlFor="cnhStatus" className="block text-sm font-medium text-gray-300">
            Opção CNH
          </label>
          <select
            id="cnhStatus"
            name="cnhStatus"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            required
          >
            <option value="">Selecione uma opção</option>
            <option value="cassada">Cassada</option>
            <option value="suspensa">Suspensa</option>
          </select>
        </div>

        <div>
          <label htmlFor="cnhFile" className="block text-sm font-medium text-gray-300">
            Anexo CNH
          </label>
          <input
            type="file"
            id="cnhFile"
            name="cnhFile"
            className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            required
          />
        </div>

        <div>
          <label htmlFor="addressFile" className="block text-sm font-medium text-gray-300">
            Anexo Comprovante de Endereço
          </label>
          <input
            type="file"
            id="addressFile"
            name="addressFile"
            className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Enviar Processo
        </button>
      </form>
    </div>
  );
}