import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Certifica-se de que o app admin do Firebase é inicializado apenas uma vez
if (!getApps().length) {
    const serviceAccount = JSON.parse(
        typeof process.env.FIREBASE_SERVICE_ACCOUNT_KEY === 'string'
            ? process.env.FIREBASE_SERVICE_ACCOUNT_KEY
            : '{}'
    );

    initializeApp({
        credential: cert(serviceAccount),
    });
}

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        // Validação básica
        if (!email || !password || !name) {
            return NextResponse.json({ message: 'E-mail, senha e nome são obrigatórios.' }, { status: 400 });
        }
        
        // Cria um novo usuário no Firebase Auth
        const auth = getAuth();
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name,
        });

        console.log(`Novo franqueado cadastrado: ${userRecord.uid}`);
        return NextResponse.json({
            message: `Franqueado ${name} cadastrado com sucesso!`,
            userId: userRecord.uid
        }, { status: 200 });

    } catch (error: any) {
        // Trata erros específicos do Firebase Auth
        if (error.code === 'auth/email-already-exists') {
            return NextResponse.json({ message: 'O e-mail fornecido já está em uso.' }, { status: 409 });
        }
        console.error('Erro ao cadastrar franqueado:', error);
        return NextResponse.json({
            message: 'Erro interno ao cadastrar franqueado.',
            details: error.message
        }, { status: 500 });
    }
}
