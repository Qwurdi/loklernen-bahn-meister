
import { useNetworkStatus } from '@/hooks/use-network-status';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface NetworkStatusIndicatorProps {
  className?: string;
  showTooltip?: boolean;
}

export default function NetworkStatusIndicator({
  className,
  showTooltip = true
}: NetworkStatusIndicatorProps) {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [showNotification, setShowNotification] = useState(false);
  
  // Show notification when status changes
  useEffect(() => {
    if (wasOffline || !isOnline) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);
  
  if (isOnline && !wasOffline && !showNotification) {
    return null; // Don't show anything when everything is normal
  }
  
  // Tooltip content
  const getTooltipContent = () => {
    if (!isOnline) return "Du bist offline. Einige Funktionen sind eingeschränkt.";
    if (wasOffline) return "Verbindung wiederhergestellt. Daten werden synchronisiert.";
    return "";
  };
  
  // Base container styles
  const containerStyles = cn(
    "flex items-center gap-1.5 px-2 py-1 rounded-md text-sm transition-all",
    isOnline ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700",
    showNotification ? "opacity-100" : "opacity-80 hover:opacity-100",
    className
  );
  
  return (
    <div className={containerStyles} role="status">
      {isOnline ? (
        <Wifi size={16} className="text-green-500" />
      ) : (
        <WifiOff size={16} className="text-amber-500" />
      )}
      
      {showTooltip && (
        <span>{getTooltipContent()}</span>
      )}
    </div>
  );
}
