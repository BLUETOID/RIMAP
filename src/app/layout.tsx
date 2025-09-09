import './globals.css'
import { Navbar } from '../components/SimpleNavbar'
import { HydratedAppProvider } from '../context/HydratedAppContext'
import ErrorBoundary from '../components/ErrorBoundary'

export const metadata = {
  title: 'RIMAAP',
  description: 'Connect with your alumni network',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ErrorBoundary>
          <HydratedAppProvider>
            <Navbar />
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
          </HydratedAppProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
