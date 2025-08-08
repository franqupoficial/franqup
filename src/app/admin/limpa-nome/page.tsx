// src/app/admin/limpa-nome/page.tsx
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

export default async function LimpaNomePage() {
    
    // Busca dados da tabela 'limpanome'
    const { data: limpaNomeData, error } = await supabaseServer
        .from('limpanome')
        .select('*');
        
    if (error) {
        console.error('Erro ao buscar dados de Limpa Nome:', error);
    }

    // Mapeia os dados da tabela para a interface que a tabela do painel espera
    const requests: RequestData[] = (limpaNomeData || []).map(item => ({
        id: item.id,
        serviceType: 'limpa-nome',
        clientName: item.nome_completo,
        clientCpf: item.cpf,
        cnhSituation: 'N/A', // A tabela limpanome não tem esta coluna
        timestamp: new Date(item.created_at),
        // Anexos serão adicionados depois
        cnhAttachment: null,
        addressProofAttachment: null,
    }));

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Gerenciamento: Limpa Nome</h2>
            <AdminDashboardTable requests={requests} />
        </div>
    );
}