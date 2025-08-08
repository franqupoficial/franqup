import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isProtectedPath = request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/franquedo');

  // Redireciona usuários não autenticados de rotas protegidas para a página de login
  if (isProtectedPath && !user) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Redireciona usuários autenticados para a página correta após o login
  if (user && request.nextUrl.pathname === '/auth') {
    const { data: franqueadoData } = await supabase
      .from('franqueados')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (franqueadoData) {
      // Se o usuário tem um registro de franqueado, redireciona para o painel de franqueado
      return NextResponse.redirect(new URL('/franquedo', request.url));
    } else if (user.email === 'admin@franqup.com') {
      // Se o usuário é o admin, redireciona para o painel de admin
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Se o usuário está logado mas não é franqueado nem admin, redireciona para a página inicial
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};