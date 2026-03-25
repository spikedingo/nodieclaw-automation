import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Checkmate — Stay on top of your tasks',
  description: 'A fast, minimal todo app with priorities, due dates, and dark mode.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      {/*
        suppressHydrationWarning: the 'dark' class is set by useTheme on the client
        to avoid a flash of wrong theme. suppressHydrationWarning silences the
        server/client mismatch warning for the className attribute on <html>.
      */}
      <head>
        {/* Inline script to set dark class before first paint — prevents FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('checkmate_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = saved === 'dark' || (saved !== 'light' && prefersDark);
                  if (isDark) document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
