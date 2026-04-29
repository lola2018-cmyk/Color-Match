import type { Metadata } from 'next';
import './globals.css';
import { ThemeInitializer } from '@/components/theme/ThemeInitializer';

export const metadata: Metadata = {
  title: 'Соревновательный Color Match',
  description: 'Современный pink-styled стресс-тренажёр по тесту Струпа с матчами, статистикой и рейтингом.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <ThemeInitializer />
        {children}
      </body>
    </html>
  );
}
