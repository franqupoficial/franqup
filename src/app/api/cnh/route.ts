// src/app/api/cnh/route.ts
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    // Adicione 'franqueadoId' ao destructuring
    const { clientName, clientCpf, cnhStatus, franqueadoId } = await request.json();

    // Verifique se o franqueadoId foi enviado
    if (!clientName || !clientCpf || !cnhStatus || !franqueadoId) {
      return NextResponse.json({
        message: 'Dados incompletos para a solicitação.'
      }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('processos')
      .insert([
        { 
          service: 'cnh',
          client_name: clientName,
          cnh_status: cnhStatus,
          franqueado_id: franqueadoId, // Salva o ID do franqueado
        }
      ]);

    if (error) {
      console.error('Erro ao inserir no Supabase:', error);
      throw new Error('Falha ao registrar a solicitação no banco de dados.');
    }

    return NextResponse.json({
      message: 'Solicitação de Processo CNH registrada com sucesso!',
      data: data
    }, { status: 200 });

  } catch (error: any) {
    console.error('Erro no endpoint /api/cnh:', error);
    return NextResponse.json({
      message: 'Erro interno do servidor.',
      error: error.message
    }, { status: 500 });
  }
}