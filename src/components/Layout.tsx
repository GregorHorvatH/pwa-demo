import { Outlet, useNavigate } from 'react-router';
import { LogOut, CheckSquare, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-neutral-100 flex flex-col transition-colors duration-300">
      {/* HEADER */}
      <header className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 p-4 flex justify-between items-center sticky top-0 z-10">
        <span className="font-bold text-xl flex items-center gap-2">
          <CheckSquare className="text-brand" />
          <span>PWA Demo</span>
        </span>

        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
          <div className="flex items-center gap-1 border border-gray-200 dark:border-neutral-700 rounded-full p-1 bg-gray-50 dark:bg-neutral-800">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white shadow-sm text-brand' : 'text-gray-400'}`}
            >
              <Sun size={16} />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-neutral-700 shadow-sm text-brand' : 'text-gray-400'}`}
            >
              <Moon size={16} />
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full text-gray-500 dark:text-neutral-400 transition-colors"
            title="Log out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-4">
        <Outlet />
      </main>

      <nav className="bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 flex justify-around p-3 pb-6 md:pb-3 fixed bottom-0 w-full shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            window.location.pathname === '/' ? 'text-brand' : 'text-gray-400 dark:text-neutral-500'
          }`}
        >
          <CheckSquare size={24} />
          <span className="text-[10px] font-medium uppercase tracking-wider">Todos</span>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            window.location.pathname === '/profile' ? 'text-brand' : 'text-gray-400 dark:text-neutral-500'
          }`}
        >
          <User size={24} />
          <span className="text-[10px] font-medium uppercase tracking-wider">Profile</span>
        </button>
      </nav>
    </div>
  );
}
