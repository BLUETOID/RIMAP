import './globals.css'
import { Navbar } from '../components/navbar'
import { AppProvider } from '../context/AppContext'

export const metadata = {
  title: 'Alumni Connect',
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
        <AppProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  )
}
