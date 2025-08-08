import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function SolicitacoesPage() {
    const cookieStore = cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth');
    }

    let franqueadoId;
    const { data: franqueadoData } = await supabase
        .from('franqueados')
        .select('id')
        .eq('user_id', user.id)
        .single();
    
    if (franqueadoData) {
        franqueadoId = franqueadoData.id;
    } else {
        redirect('/auth');
    }

    const { data: processos } = await supabase
        .from('processos')
        .select('*')
        .eq('franqueado_id', franqueadoId);

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Minhas Solicitações</h1>
            
            <section>
                <h2 className="text-2xl font-semibold mb-4">Lista de Processos</h2>
                {processos && processos.length > 0 ? (
                    <ul className="space-y-4">
                        {processos.map(processo => (
                            <li key={processo.id} className="p-4 bg-gray-800 rounded-lg">
                                <h3 className="text-xl font-bold">{processo.service}</h3>
                                <p>Cliente: {processo.client_name}</p>
                                <p>Status CNH: {processo.cnh_status}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">Nenhum processo encontrado.</p>
                )}
            </section>
        </div>
    );
}