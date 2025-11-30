import { Brain } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <Brain className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Context Engine
          </span>
        </Link>
        {!isHome && (
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Start Over
          </Link>
        )}
      </div>
    </header>
  );
}