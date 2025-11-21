import '../styles/globals.css'
import { AuthProvider } from "@/components/AuthProvider";


export const metadata = {
  title: 'Smart Solar Panel Cleaner',
  description: 'IoT + Computer Vision system for monitoring and cleaning solar panels',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

