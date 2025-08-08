// src/app/admin/cnh/page.tsx
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

export default async function CnhPage() {
    
    // Busca dados da tabela 'processos'
    const { data: cnhData, error } = await supabaseServer
        .from('processos')
        .select('*');
        
    if (error) {
        console.error('Erro ao buscar dados de CNH:', error);
    }

    // Mapeia os dados da tabela para a interface que a tabela do painel espera
    const requests: RequestData[] = (cnhData || []).map(item => ({
        id: item.id,
        serviceType: 'cnh',
        clientName: item.client_name,
        clientCpf: 'N/A', // O CPF não está na sua tabela 'processos'
        cnhSituation: item.cnh_status,
        timestamp: new Date(item.created_at),
        // Anexos serão adicionados depois
        cnhAttachment: null,
        addressProofAttachment: null,
    }));

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Gerenciamento: Processos CNH</h2>
            <AdminDashboardTable requests={requests} />
        </div>
    );
}