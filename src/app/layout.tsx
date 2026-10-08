import { Providers } from "@/components/Providers"
import ClientLayout from "./client-layout"
import "@/styles/globals.css"

export const metadata = {
  title: "PropFi - Tokenized Real Estate Protocol",
  description: "Decentralized real estate protocol on Stellar",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  )
}