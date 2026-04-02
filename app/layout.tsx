import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { BottomNav } from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'Silver Grid Note',
  description: 'A modern, colorful note-taking application inspired by ColorNote.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-gray-200 text-gray-900 font-sans antialiased">
        <div className="max-w-md mx-auto bg-white min-h-[100dvh] shadow-xl relative pb-14 flex flex-col">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
