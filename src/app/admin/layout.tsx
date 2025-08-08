// src/app/admin/layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <aside className="w-64 p-4 border-r border-gray-700">
        <h1 className="text-2xl font-bold mb-6">Painel Admin</h1>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/admin">
                <p className="block p-2 rounded hover:bg-gray-700 transition-colors">
                  Dashboard
                </p>
              </Link>
            </li>
            {/* ... Outros links do menu ... */}
            <li>
              <Link href="/admin/profile">
                <p className="block p-2 rounded hover:bg-gray-700 transition-colors">
                  Meu Perfil
                </p>
              </Link>
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