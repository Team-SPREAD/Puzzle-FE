import './globals.css'


export const metadata = {
  title: '퍼즐',
  description: '프로젝트 개발 가이드라인을 제공하는 플랫폼',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
