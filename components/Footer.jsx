export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Solar Monitor</h3>
            <p className="text-gray-400 text-sm">
              Advanced solar panel monitoring system with ML-powered predictions for optimal performance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/upload" className="text-gray-400 hover:text-white transition-colors">
                  Upload
                </a>
              </li>
              <li>
                <a href="/auth/login" className="text-gray-400 hover:text-white transition-colors">
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: support@solarmonitor.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Solar St, Green City</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Solar Monitor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

