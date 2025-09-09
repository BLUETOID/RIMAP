import './globals.css'
import { Navbar } from '../components/navbar'
import { AppProvider } from '../context/AppContext'
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
          <AppProvider>
            <Navbar />
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
          </AppProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
