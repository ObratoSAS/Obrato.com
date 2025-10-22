import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Obrato LMS',
  description: 'Plataforma LMS moderna inspirada en Moodle'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900`}>
        <Providers>
          <div className="min-h-screen">
            <header className="bg-white shadow-sm">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <div className="text-lg font-semibold text-primary-600">Obrato LMS</div>
                <nav className="flex gap-4 text-sm">
                  <Link className="hover:text-primary-600" href="/courses">
                    Cursos
                  </Link>
                  <Link className="hover:text-primary-600" href="/dashboard">
                    Panel
                  </Link>
                  <Link className="hover:text-primary-600" href="/admin">
                    Administración
                  </Link>
                </nav>
              </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
            <footer className="bg-white py-6 text-center text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Obrato LMS
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
