import { useState } from 'react';
import { supabase } from '../api/supabase';
import { toast } from 'sonner';
import { LogIn, UserPlus, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isRegistering) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) toast.error(error.message);
      else toast.success('Registration successful! You can now log in.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) toast.error(error.message);
      else toast.success('Welcome back!');
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-neutral-950 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800">
        <div className="flex justify-center mb-6 text-brand">
          {isRegistering ? <UserPlus size={48} /> : <LogIn size={48} />}
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center dark:text-white">
          {isRegistering ? 'Create an account' : 'Log in'}
        </h1>
        <p className="text-gray-500 dark:text-neutral-400 text-center mb-8 text-sm">
          {isRegistering ? 'Enter your details to register' : 'Enter your email and password'}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-transparent focus:border-brand rounded-xl outline-none dark:text-white transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-transparent focus:border-brand rounded-xl outline-none dark:text-white transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 text-orange-500 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-sm shadow-brand/30 active:scale-[0.98] cursor-pointer flex justify-center items-center"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Please wait...</span>
              </div>
            ) : (
              isRegistering ? 'Register' : 'Log in'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-gray-500 dark:text-neutral-400 hover:text-brand underline transition-colors"
          >
            {isRegistering ? 'Already have an account? Log in' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}