'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function handleSubmitCnhForm(formData) {
    const cookieStore = cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth');
    }

    const cnhStatus = formData.get('cnhStatus');
    const cnhFile = formData.get('cnhFile');
    const addressFile = formData.get('addressFile');

    if (!cnhStatus || !cnhFile || !addressFile) {
        throw new Error('Todos os campos são obrigatórios.');
    }

    const bucketName = 'documentos-franqueados';

    const { data: cnhUpload, error: cnhError } = await supabase.storage
        .from(bucketName)
        .upload(`cnh/${user.id}/${Date.now()}_cnh`, cnhFile);

    if (cnhError) {
        console.error('Erro ao fazer upload do arquivo CNH:', cnhError);
        throw new Error('Falha no upload do arquivo CNH.');
    }

    const { data: addressUpload, error: addressError } = await supabase.storage
        .from(bucketName)
        .upload(`comprovantes/${user.id}/${Date.now()}_comprovante`, addressFile);

    if (addressError) {
        console.error('Erro ao fazer upload do comprovante de endereço:', addressError);
        throw new Error('Falha no upload do comprovante de endereço.');
    }

    const { data, error: dbError } = await supabase
        .from('processos')
        .insert({
            user_id: user.id,
            service: 'CNH',
            status_cnh: cnhStatus,
            cnh_document_url: cnhUpload.path,
            address_document_url: addressUpload.path,
        });

    if (dbError) {
        console.error('Erro ao salvar no banco de dados:', dbError);
        throw new Error('Falha ao salvar o processo.');
    }

    redirect('/franquedo/pagamento');
}