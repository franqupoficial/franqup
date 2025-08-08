// src/app/admin/todas-solicitacoes/page.tsx
import { AdminDashboardTable } from "@/components/AdminDashboardTable";
import React from 'react';
import { supabaseServer } from '@/lib/supabase-server';

// Defina a interface para os dados das solicitações
interface RequestData {
    id: string;
    serviceType: string;
    clientName: string;
    clientCpf?: string;
    cnhSituation?: string;
    timestamp: Date;
    cnhAttachment?: { fileName: string; data: string };
    addressProofAttachment?: { fileName: string; data: string };
}

export default async function AdminTodasSolicitacoesPage() {
    
    // Busca dados da tabela 'limpanome'
    const { data: limpaNomeData, error: limpaNomeError } = await supabaseServer
        .from('limpanome')
        .select('*');

    // Busca dados da tabela 'processos' (para CNH)
    const { data: processosData, error: processosError } = await supabaseServer
        .from('processos')
        .select('*');
        
    if (limpaNomeError) {
        console.error('Erro ao buscar dados de Limpa Nome:', limpaNomeError);
    }
    if (processosError) {
        console.error('Erro ao buscar dados de Processos:', processosError);
    }

    // Combina e processa os dados de ambos os serviços
    const allRequests: RequestData[] = [
        ...(limpaNomeData || []).map(item => ({
            id: item.id,
            serviceType: 'limpa-nome',
            clientName: item.nome_completo,
            clientCpf: item.cpf,
            cnhSituation: 'N/A',
            timestamp: new Date(item.created_at),
        })),
        ...(processosData || []).map(item => ({
            id: item.id,
            serviceType: item.service,
            clientName: item.client_name,
            clientCpf: 'N/A',
            cnhSituation: item.cnh_status,
            timestamp: new Date(item.created_at),
        })),
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Ordena por data mais recente

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Todas as Solicitações</h2>
            <p className="text-gray-400 mb-8">Visão geral de todas as solicitações de todos os serviços.</p>
            <AdminDashboardTable requests={allRequests} />
        </div>
    );
}