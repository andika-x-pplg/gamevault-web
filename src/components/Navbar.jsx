import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Gamepad2, Search, Heart, User, Compass, Home, LayoutGrid, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`)
      setMobileMenuOpen(false)
    }
  }

  const navLinkClass = ({ isActive }) =>
    `relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-white bg-indigo-500/15 border border-indigo-500/30 shadow-inner'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
    }`

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B0E14]/85 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-xl tracking-wide group flex-shrink-0"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="font-extrabold tracking-tight text-lg sm:text-xl text-white">
              Game<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Vault</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/" className={navLinkClass} end>
              <Home className="w-4 h-4 text-indigo-400" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/browse" className={navLinkClass}>
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Browse</span>
            </NavLink>
            <NavLink to="/browse?category=all" className={navLinkClass}>
              <LayoutGrid className="w-4 h-4 text-indigo-400" />
              <span>Categories</span>
            </NavLink>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-sm hidden sm:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari game gratis, open-source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111726]/90 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </form>
          </div>

          {/* Right Action Icons & Login */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Wishlist Button */}
            <button
              type="button"
              className="relative p-2 rounded-xl text-slate-300 hover:text-white bg-[#111726]/60 hover:bg-slate-800 border border-slate-800 transition-all hover:border-slate-700"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 text-rose-400 hover:fill-rose-400 transition-colors" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Login Button */}
            <button
              type="button"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border border-indigo-500/40 shadow-sm shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-[#111726] border border-slate-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800/80 space-y-3">
            <form onSubmit={handleSearch} className="relative sm:hidden">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari game..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111726] border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
              />
            </form>
            <div className="flex flex-col gap-1">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
                end
              >
                <Home className="w-4 h-4 text-indigo-400" />
                <span>Home</span>
              </NavLink>
              <NavLink
                to="/browse"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                <Compass className="w-4 h-4 text-indigo-400" />
                <span>Browse Games</span>
              </NavLink>
              <NavLink
                to="/browse?category=all"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                <LayoutGrid className="w-4 h-4 text-indigo-400" />
                <span>Categories</span>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
