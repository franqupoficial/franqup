'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function updateProcessStatus(formData) {
    const cookieStore = cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const processoId = formData.get('processoId');
    const newStatus = formData.get('status');

    if (!processoId || !newStatus) {
        throw new Error('ID do processo e status são obrigatórios.');
    }

    const { data, error } = await supabase
        .from('processos')
        .update({ status: newStatus })
        .eq('id', processoId);

    if (error) {
        console.error('Erro ao atualizar o status:', error);
        throw new Error('Falha ao atualizar o status do processo.');
    }

    // Limpa o cache para que a página mostre os dados atualizados
    revalidatePath(`/admin/processos/${processoId}`);

    return { success: true };
}