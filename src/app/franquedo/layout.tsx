import { ReactNode } from 'react';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

interface FranquedoLayoutProps {
  children: ReactNode;
}

export default async function FranquedoLayout({ children }: FranquedoLayoutProps) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  let franqueadoNome = 'Franqueado';
  const { data: franqueadoData } = await supabase
    .from('franqueados')
    .select('nome')
    .eq('user_id', user.id)
    .single();
  
  if (franqueadoData) {
    franqueadoNome = franqueadoData.nome;
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <aside className="w-64 p-4 border-r border-gray-700">
        <h1 className="text-2xl font-bold mb-6">Painel {franqueadoNome}</h1>
        <nav>
          <ul className="space-y-2">
            <li><Link href="/franquedo"><p className="block p-2 rounded hover:bg-gray-700 transition-colors">Dashboard</p></Link></li>
            <li><Link href="/franquedo/solicitacoes"><p className="block p-2 rounded hover:bg-gray-700 transition-colors">Minhas Solicitações</p></Link></li>
            <li><Link href="/franquedo/nova-solicitacao"><p className="block p-2 rounded hover:bg-gray-700 transition-colors">Nova Solicitação</p></Link></li>
            <li><Link href="/franquedo/profile"><p className="block p-2 rounded hover:bg-gray-700 transition-colors">Meu Perfil</p></Link></li>
            <li>
                <form action="/api/auth/logout" method="post">
                    <button type="submit" className="w-full text-left block p-2 rounded hover:bg-red-700 transition-colors">
                        Sair
                    </button>
                </form>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}