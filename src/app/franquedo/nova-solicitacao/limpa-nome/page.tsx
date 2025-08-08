'use client';

import { handleSubmitLimpaNomeForm } from './actions';
import React from 'react';

export default function LimpaNomeFormPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Limpa Nome</h1>
      <p className="text-lg text-gray-400">Preencha os dados e anexe o documento para iniciar o processo.</p>

      <form action={handleSubmitLimpaNomeForm} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
            Nome Completo
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-300">
            CPF
          </label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="documentFile" className="block text-sm font-medium text-gray-300">
            Anexo Foto de Documento
          </label>
          <input
            type="file"
            id="documentFile"
            name="documentFile"
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