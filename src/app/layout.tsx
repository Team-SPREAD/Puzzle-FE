import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Toaster } from '@/components/ui/Toaster';

export const metadata: Metadata = {
  title: '퍼즐',
  description: '프로젝트 개발 가이드라인을 제공하는 플랫폼',
  icons: {
    icon: '/images/logo/favicon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
