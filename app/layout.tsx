import ".//globals.css";
import Providers from "./providers";

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="mb-24">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
