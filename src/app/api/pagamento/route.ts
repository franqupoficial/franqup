import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { clientName, clientCpf, serviceType } = await request.json();

    if (!serviceType) {
      return NextResponse.json({
        message: 'Tipo de serviço ausente.'
      }, { status: 400 });
    }

    // Apenas verifica nome e CPF para serviços que precisam
    if (serviceType !== 'cnh' && (!clientName || !clientCpf)) {
      return NextResponse.json({
        message: 'Dados do cliente ou tipo de serviço ausentes.'
      }, { status: 400 });
    }

    let paymentUrl = '';

    switch (serviceType) {
      case 'cnh':
        // Link de pagamento para o serviço CNH
        paymentUrl = 'https://pag.ae/7_WiVJRnL';
        break;
      case 'limpa-nome':
        // O link real para o serviço Limpa Nome
        paymentUrl = 'https://pag.ae/7_WiYnwm5';
        break;
      default:
        return NextResponse.json({
          message: 'Tipo de serviço desconhecido.'
        }, { status: 400 });
    }

    if (!paymentUrl) {
      throw new Error('O link de pagamento para o serviço ' + serviceType + ' não foi configurado.');
    }

    return NextResponse.json({
      message: 'Link de pagamento gerado com sucesso!',
      paymentUrl: paymentUrl
    }, { status: 200 });

  } catch (error) {
    console.error('Erro ao criar o pagamento:', error);
    return NextResponse.json({
      message: 'Erro ao gerar link de pagamento.',
      success: false
    }, { status: 500 });
  }
}
