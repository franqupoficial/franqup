// src/app/api/limpa-nome/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Certifique-se de que este caminho está correto

export async function POST(request: Request) {
  try {
    const { clientName, clientCpf } = await request.json();

    if (!clientName || !clientCpf) {
      return NextResponse.json({
        message: 'Nome do cliente ou CPF ausentes.'
      }, { status: 400 });
    }

    // Insere os dados na tabela 'limpanome' usando os nomes de colunas corretos
    const { data, error } = await supabase
      .from('limpanome')
      .insert([
        { nome_completo: clientName, cpf: clientCpf }
      ]);

    if (error) {
      console.error('Erro ao inserir no Supabase:', error);
      throw new Error('Falha ao registrar a solicitação no banco de dados.');
    }

    return NextResponse.json({
      message: 'Solicitação de Limpa Nome registrada com sucesso!',
      data: data
    }, { status: 200 });

  } catch (error: any) {
    console.error('Erro no endpoint /api/limpa-nome:', error);
    return NextResponse.json({
      message: 'Erro interno do servidor.',
      error: error.message
    }, { status: 500 });
  }
}