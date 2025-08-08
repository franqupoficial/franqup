// src/app/admin/solicitacao/[id]/page.tsx
import React from 'react';
import { supabaseServer } from '@/lib/supabase-server';

interface RequestDetailsPageProps {
    params: {
        id: string;
    };
}

export default async function RequestDetailsPage({ params }: RequestDetailsPageProps) {
    const { id } = params;

    // Busca nas duas tabelas para encontrar a solicitação
    let request = null;

    // Tenta buscar na tabela 'processos'
    const { data: processosData } = await supabaseServer
        .from('processos')
        .select('*')
        .eq('id', id)
        .single();
    
    if (processosData) {
        request = {
            serviceType: 'cnh',
            clientName: processosData.client_name,
            cnhSituation: processosData.cnh_status,
            timestamp: processosData.created_at,
            franqueadoId: processosData.franqueado_id,
        };
    } else {
        // Tenta buscar na tabela 'limpanome'
        const { data: limpaNomeData } = await supabaseServer
            .from('limpanome')
            .select('*')
            .eq('id', id)
            .single();

        if (limpaNomeData) {
            request = {
                serviceType: 'limpa-nome',
                clientName: limpaNomeData.nome_completo,
                clientCpf: limpaNomeData.cpf,
                timestamp: limpaNomeData.created_at,
                franqueadoId: limpaNomeData.franqueado_id,
            };
        }
    }

    if (!request) {
        return (
            <div className="text-center p-8">
                <h2 className="text-3xl font-bold text-red-400">Solicitação não encontrada.</h2>
                <p className="mt-4 text-gray-400">O ID informado não corresponde a nenhuma solicitação.</p>
            </div>
        );
    }
    
    // Ajudante para formatar a data
    const formattedDate = new Date(request.timestamp).toLocaleString();
    
    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Detalhes da Solicitação</h2>
            <p className="text-gray-400 mb-8">Informações completas sobre a solicitação #{id.slice(0, 8)}...</p>

            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl space-y-6">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Cliente: {request.clientName}</h3>
                    <p className="text-sm text-gray-400">Registrado em: {formattedDate}</p>
                </div>
                
                <hr className="border-gray-700" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-300 font-semibold">Tipo de Serviço:</p>
                        <p className="text-white mt-1">{request.serviceType === 'limpa-nome' ? 'Limpa Nome' : 'Processos CNH'}</p>
                    </div>
                    {request.clientCpf && (
                        <div>
                            <p className="text-gray-300 font-semibold">CPF do Cliente:</p>
                            <p className="text-white mt-1">{request.clientCpf}</p>
                        </div>
                    )}
                    {request.cnhSituation && (
                        <div>
                            <p className="text-gray-300 font-semibold">Situação da CNH:</p>
                            <p className="text-white mt-1">{request.cnhSituation}</p>
                        </div>
                    )}
                    {request.franqueadoId && (
                        <div>
                            <p className="text-gray-300 font-semibold">ID do Franqueado:</p>
                            <p className="text-white mt-1">{request.franqueadoId}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}