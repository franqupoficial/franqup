import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { createFranqueado } from './actions';

export default async function NovoFranqueadoPage() {
    const cookieStore = cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'admin@franqup.com') {
        redirect('/auth');
    }
    
    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Cadastrar Novo Franqueado</h1>
            <p className="text-lg text-gray-400">Preencha os dados para criar uma nova conta de franqueado.</p>

            <Link href="/admin" className="text-purple-400 hover:text-purple-300 transition-colors">← Voltar para o painel</Link>

            <form action={createFranqueado} className="space-y-6">
                <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-300">
                        Nome do Franqueado
                    </label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                        Senha
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                    Cadastrar Franqueado
                </button>
            </form>
        </div>
    );
}