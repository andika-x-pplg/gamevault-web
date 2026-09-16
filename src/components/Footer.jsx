import { Link } from 'react-router-dom'
import { Gamepad2, ShieldCheck, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#080B10] text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 font-bold text-xl group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <span className="text-white font-extrabold text-xl tracking-tight">
                Game<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Vault</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Platform kurasi dan katalog game PC legal dan gratis. Temukan game open-source, freeware berkualitas, free-to-play, dan demo resmi tanpa pembajakan.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Legal & Bebas Malware</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-indigo-400 transition-colors">
                  Browse Games
                </Link>
              </li>
              <li>
                <Link to="/browse?category=all" className="hover:text-indigo-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/browse?license=open-source" className="hover:text-indigo-400 transition-colors">
                  Open-Source Games
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Resources & Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-indigo-400 transition-colors cursor-pointer">
                  Tentang GameVault
                </span>
              </li>
              <li>
                <span className="hover:text-indigo-400 transition-colors cursor-pointer">
                  FAQ & Bantuan
                </span>
              </li>
              <li>
                <span className="hover:text-indigo-400 transition-colors cursor-pointer">
                  Kebijakan Privasi
                </span>
              </li>
              <li>
                <span className="hover:text-indigo-400 transition-colors cursor-pointer">
                  Pedoman Lisensi Legal
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center md:text-left">
          <p className="max-w-2xl leading-relaxed">
            <strong>Pernyataan Legal:</strong> GameVault ditujukan untuk membantu pengguna menemukan dan mengunduh game free-to-play, freeware, open-source, dan demo dari sumber distribusi yang legal dan terpercaya. Kami menolak segala bentuk pembajakan perangkat lunak.
          </p>
          <p className="flex items-center gap-1 flex-shrink-0">
            © {new Date().getFullYear()} GameVault. Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> untuk gamer PC.
          </p>
        </div>
      </div>
    </footer>
  )
}
