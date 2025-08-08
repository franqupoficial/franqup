'use server';

import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createFranqueado(formData) {
    const email = formData.get('email');
    const password = formData.get('password');
    const nome = formData.get('nome');

    if (!email || !password || !nome) {
        throw new Error('Email, senha e nome são obrigatórios.');
    }
    
    // ATENÇÃO: SUBSTITUA O TEXTO ABAIXO PELA SUA NOVA CHAVE DE service_role
    const NEW_SERVICE_ROLE_KEY = "sb_secret_srK7B-BFKhYTn0DFjRxrLQ_9YjBnzT_";

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        NEW_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
    });

    if (userError) {
        console.error('Erro ao criar usuário no Auth:', userError);
        throw new Error('Falha ao criar o usuário.');
    }

    const { data: franqueadoData, error: franqueadoError } = await supabaseAdmin
        .from('franqueados')
        .insert({
            user_id: userData.user.id,
            nome: nome,
            status: 'ativo',
        });

    if (franqueadoError) {
        console.error('Erro ao inserir franqueado na tabela:', franqueadoError);
        throw new Error('Falha ao registrar o franqueado.');
    }

    revalidatePath('/admin');
    redirect('/admin');
}