import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { updateProcessStatus } from './actions';

export default async function ProcessoDetalhesPage({ params }) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);
  const processoId = params.id;

  if (!processoId) {
    notFound();
  }

  // Busca o processo pelo ID
  const { data: processo, error } = await supabase
    .from('processos')
    .select('*')
    .eq('id', processoId)
    .single();

  if (error || !processo) {
    notFound();
  }
  
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Detalhes do Processo #{processo.id.substring(0, 8)}</h1>
      <Link href="/admin" className="text-purple-400 hover:text-purple-300 transition-colors">← Voltar para o painel</Link>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Informações do Processo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Serviço</p>
            <p className="text-lg font-medium">{processo.service}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Status</p>
            <p className="text-lg font-medium">{processo.status || 'Pendente'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Franqueado ID</p>
            <p className="text-lg font-medium">{processo.user_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Data de Envio</p>
            <p className="text-lg font-medium">{new Date(processo.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      {/* Formulário de Atualização de Status */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Atualizar Status</h2>
        <form action={updateProcessStatus} className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <input type="hidden" name="processoId" value={processo.id} />
          
          <select
            name="status"
            className="flex-grow pl-3 pr-10 py-2 text-base bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            defaultValue={processo.status || 'Pendente'}
          >
            <option value="Pendente">Pendente</option>
            <option value="Em Análise">Em Análise</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Rejeitado">Rejeitado</option>
          </select>
          
          <button
            type="submit"
            className="w-full md:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Salvar Status
          </button>
        </form>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Documentos Anexados</h2>
        {processo.cnh_document_url && (
            <div className="mb-2">
                <p className="text-sm text-gray-400">Documento CNH</p>
                <Link href={processo.cnh_document_url} target="_blank" className="text-purple-400 hover:text-purple-300 underline">
                    Ver documento
                </Link>
            </div>
        )}
        {processo.address_document_url && (
            <div className="mb-2">
                <p className="text-sm text-gray-400">Comprovante de Endereço</p>
                <Link href={processo.address_document_url} target="_blank" className="text-purple-400 hover:text-purple-300 underline">
                    Ver comprovante
                </Link>
            </div>
        )}
        {processo.document_url && (
            <div className="mb-2">
                <p className="text-sm text-gray-400">Documento Limpa Nome</p>
                <Link href={processo.document_url} target="_blank" className="text-purple-400 hover:text-purple-300 underline">
                    Ver documento
                </Link>
            </div>
        )}
      </div>
    </div>
  );
}