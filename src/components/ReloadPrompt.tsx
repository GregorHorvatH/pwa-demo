import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export default function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // Check for updates every 10 minutes (600000 ms)
        // For testing you can set 10000 (10 sec)
        setInterval(() => {
          r.update();
        }, 600000);
      }
      console.log('SW Registered');
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  useEffect(() => {
    const checkUpdate = async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
        }
      }
    };

    window.addEventListener('focus', checkUpdate);
    return () => window.removeEventListener('focus', checkUpdate);
  }, []);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-2xl rounded-2xl p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="bg-brand/10 p-2 rounded-lg text-brand">
              <RefreshCw
                size={20}
                className={`text-brand ${needRefresh ? 'animate-spin' : ''}`}
              />
            </div>
            <div>
              <p className="text-sm font-bold dark:text-white">
                {needRefresh ? 'Update available!' : 'Ready to work'}
              </p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                {needRefresh
                  ? 'A new version is ready to install.'
                  : 'The app is running in offline mode.'}
              </p>
            </div>
          </div>
          <button
            onClick={close}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer p-1"
          >
            <X size={18} />
          </button>
        </div>

        {needRefresh && (
          <button
            onClick={async () => {
              await updateServiceWorker(true);
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }}
            className="w-full py-2 text-sm text-brand font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-sm shadow-brand/20"
          >
            Update now
          </button>
        )}
      </div>
    </div>
  );
}
