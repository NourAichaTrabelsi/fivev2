import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Adoption Haven – Safe Families for Every Child',
  description:
    'Match children with verified, loving families. Every child deserves a safe home.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
