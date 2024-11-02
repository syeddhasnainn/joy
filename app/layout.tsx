import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from 'next/font/google'

// const inter = Inter({
//   subsets: ['latin'],
//   display: 'swap',
// })

// const spaceGrotesk = Space_Grotesk({
//   subsets: ['latin'],
//   display: 'swap',
// })

// const darkerGrotesque = Darker_Grotesque({
//   subsets: ['latin'],
//   display: 'swap',
//   weight: ['400', '500', '700'],
// })

// const hankenGrotesk = Hanken_Grotesk({
//   subsets: ['latin'],
//   display: 'swap',
//   weight: ['400', '500', '700'],
// })

// const jetBrainsMono = JetBrains_Mono({
//   subsets: ['latin'],
//   display: 'swap',
//   weight: ['400', '500', '700'],
// })

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: "Joy",
  description: "A chatbot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className}`}
      >
        {children}
      </body>
    </html>
  );
}
