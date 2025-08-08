import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  // Lógica de autenticação. Por enquanto, a verificação é fixa.
  if (email === 'franqupoficial@gmail.com' && password === '12345') {
    return NextResponse.json({
      message: 'Login bem-sucedido',
      success: true,
      user: {
        name: 'Franqueado Oficial',
        email: 'franqupoficial@gmail.com'
      }
    }, { status: 200 });
  } else {
    return NextResponse.json({
      message: 'E-mail ou senha incorretos.',
      success: false
    }, { status: 401 });
  }
}