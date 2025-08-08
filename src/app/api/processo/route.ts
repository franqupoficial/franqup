import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, cpf, servico } = body;

    // Aqui você pode adicionar a lógica para salvar os dados em um banco de dados
    // ou enviar um e-mail, por exemplo.

    console.log('Novo processo recebido:', { nome, cpf, servico });

    return NextResponse.json({
      message: 'Processo enviado com sucesso!',
      success: true,
      data: { nome, cpf, servico }
    }, { status: 200 });
  } catch (error) {
    console.error('Erro ao processar o formulário:', error);
    return NextResponse.json({
      message: 'Erro interno do servidor',
      success: false
    }, { status: 500 });
  }
}