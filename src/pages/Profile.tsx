import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Profile</h1>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-neutral-800 space-y-4">
        <div className="flex items-center justify-center w-20 h-20 bg-brand/10 text-brand rounded-full mx-auto">
          <User size={40} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-xl">
            <Mail className="text-gray-400" size={20} />
            <div>
              <p className="text-[10px] uppercase text-gray-400 font-bold">Email</p>
              <p className="text-sm dark:text-neutral-200">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-xl">
            <Calendar className="text-gray-400" size={20} />
            <div>
              <p className="text-[10px] uppercase text-gray-400 font-bold">Registered</p>
              <p className="text-sm dark:text-neutral-200">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-xl">
            <ShieldCheck className="text-gray-400" size={20} />
            <div>
              <p className="text-[10px] uppercase text-gray-400 font-bold">User ID</p>
              <p className="text-[10px] font-mono text-gray-500 truncate">{user.id}</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">
        App version: 1.0.0
      </p>
    </div>
  );
}