'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/lib/Firebase'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/profile', label: 'Profile' },
    { href: '/upload', label: 'Upload' },
    { href: '/history', label: 'History' },
  ]

  const isActive = (href) => pathname === href

  const handleLogout = async () => {
    await signOut(auth)
    window.location.href = '/auth/login'
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xl font-bold text-gray-900">Solar Monitor</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">

            {user && navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Right Side (Auth) */}
            <div className="flex items-center space-x-4">

              {/* Show Login when NOT authenticated */}
              {!user && (
                <Link href="/auth/login">
                  <div className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700">
                    Login
                  </div>
                </Link>
              )}

              {/* When authenticated: show avatar + logout */}
              {user && (
                <>
                  <div className="text-gray-700 font-medium">
                    {user.email}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">

            {user && navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 font-medium ${
                  isActive(link.href)
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            {!user && (
              <Link
                href="/auth/login"
                className="block py-2 font-medium text-gray-600"
              >
                Login
              </Link>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 font-medium text-red-600"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
