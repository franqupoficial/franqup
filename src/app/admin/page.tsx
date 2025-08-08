import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { FaUser, FaFileAlt, FaCar, FaUserCheck } from 'react-icons/fa';

export default async function AdminDashboardPage() {
    const cookieStore = cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    // Verifica se o usuário é o admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'admin@franqup.com') {
        redirect('/auth');
    }

    // Busca todos os processos
    const { data: processos, error: processosError } = await supabase
        .from('processos')
        .select('*');

    // Busca todos os franqueados
    const { data: franqueados, error: franqueadosError } = await supabase
        .from('franqueados')
        .select('*');

    // -- Novos KPIs --
    const totalProcessos = processos?.length || 0;
    const totalFranqueados = franqueados?.length || 0;
    const processosPorServico = processos?.reduce((acc, processo) => {
        acc[processo.service] = (acc[processo.service] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Painel Administrativo</h1>
            <p className="text-lg text-gray-400">Visão geral de todos os processos e franqueados.</p>
            
            <div className="flex justify-end">
                <Link
                    href="/admin/franqueados/novo"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                    Cadastrar Novo Franqueado
                </Link>
            </div>

            {/* Seção de KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
                    <FaFileAlt className="text-blue-400 text-4xl" />
                    <div>
                        <p className="text-sm font-medium text-gray-400">Total de Processos</p>
                        <p className="text-3xl font-bold">{totalProcessos}</p>
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
                    <FaUserCheck className="text-green-400 text-4xl" />
                    <div>
                        <p className="text-sm font-medium text-gray-400">Franqueados Ativos</p>
                        <p className="text-3xl font-bold">{totalFranqueados}</p>
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-center">
                    <p className="text-sm font-medium text-gray-400 mb-2">Processos por Tipo</p>
                    {processosPorServico && Object.entries(processosPorServico).map(([service, count]) => (
                        <div key={service} className="flex justify-between items-center text-lg">
                            <span>{service}:</span>
                            <span className="font-bold">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Seção de todos os processos */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Todos os Processos</h2>
                {processos && processos.length > 0 ? (
                    <ul className="space-y-4">
                        {processos.map(processo => (
                            <Link href={`/admin/processos/${processo.id}`} key={processo.id}>
                                <li className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                                    <p>ID: {processo.id.substring(0, 8)}...</p>
                                    <p>Serviço: {processo.service}</p>
                                    <p>Status: {processo.status || 'Pendente'}</p>
                                    <p>Franqueado ID: {processo.user_id}</p>
                                </li>
                            </Link>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">Nenhum processo encontrado.</p>
                )}
            </section>

            {/* Seção de todos os franqueados */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Franqueados Cadastrados</h2>
                {franqueados && franqueados.length > 0 ? (
                    <ul className="space-y-4">
                        {franqueados.map(franqueado => (
                            <li key={franqueado.id} className="p-4 bg-gray-800 rounded-lg">
                                <p>ID: {franqueado.id}</p>
                                <p>User ID: {franqueado.user_id}</p>
                                <p>Status: {franqueado.status}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">Nenhum franqueado encontrado.</p>
                )}
            </section>
        </div>
    );
}