import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useOffline } from '../hooks/useOffline';

export default function OfflineIndicator() {
  const { isOnline, isSyncing, syncPendingData } = useOffline();

  return (
    <div
      className={`
        fixed bottom-4 right-4 
        flex items-center gap-2 
        px-3 py-2 rounded-full 
        shadow-lg
        ${
          isOnline
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }
      `}
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">Online</span>
          {isSyncing && <RefreshCw className="w-4 h-4 animate-spin" />}
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">Offline</span>
          <button
            onClick={() => syncPendingData()}
            className="ml-2 text-sm underline"
          >
            Sync
          </button>
        </>
      )}
    </div>
  );
}
