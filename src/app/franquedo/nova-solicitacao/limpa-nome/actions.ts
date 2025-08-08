'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function handleSubmitLimpaNomeForm(formData) {
    const cookieStore = cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth');
    }

    const fullName = formData.get('fullName');
    const cpf = formData.get('cpf');
    const documentFile = formData.get('documentFile');

    if (!fullName || !cpf || !documentFile) {
        throw new Error('Todos os campos são obrigatórios.');
    }

    const bucketName = 'documentos-franqueados';

    const { data: documentUpload, error: documentError } = await supabase.storage
        .from(bucketName)
        .upload(`documentos/${user.id}/${Date.now()}_documento`, documentFile);

    if (documentError) {
        console.error('Erro ao fazer upload do documento:', documentError);
        throw new Error('Falha no upload do documento.');
    }

    const { data, error: dbError } = await supabase
        .from('processos')
        .insert({
            user_id: user.id,
            service: 'Limpa Nome',
            client_name: fullName,
            cpf: cpf,
            document_url: documentUpload.path,
        });

    if (dbError) {
        console.error('Erro ao salvar no banco de dados:', dbError);
        throw new Error('Falha ao salvar o processo.');
    }

    redirect('/franquedo/pagamento');
}