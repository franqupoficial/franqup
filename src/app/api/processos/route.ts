import { NextResponse } from 'next/server';

const processosSimulados = [
  { id: 1, nome: "Kennedy Santos", cpf: "123.456.789-01", servico: "limpa-nome", status: "Aguardando pagamento" },
  { id: 2, nome: "Maria da Silva", cpf: "987.654.321-09", servico: "aumento-de-rating", status: "Processando" },
  { id: 3, nome: "João de Souza", cpf: "111.222.333-44", servico: "limpa-bacen", status: "Concluído" },
];

export async function GET() {
  try {
    return NextResponse.json({
      message: 'Processos listados com sucesso.',
      success: true,
      processos: processosSimulados
    }, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar processos:', error);
    return NextResponse.json({
      message: 'Erro interno do servidor',
      success: false
    }, { status: 500 });
  }
}
