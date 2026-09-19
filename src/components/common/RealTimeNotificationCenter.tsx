import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Camera, 
  ShieldCheck, 
  Ticket, 
  Trash2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { AppNotification } from '../../types';
import { getStoredNotifications, saveStoredNotifications } from '../../utils/notifications';

interface RealTimeNotificationCenterProps {
  onOpenTracker?: (bookingRef?: string) => void;
}

export const RealTimeNotificationCenter: React.FC<RealTimeNotificationCenterProps> = ({
  onOpenTracker
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getStoredNotifications());
  const [isOpen, setIsOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  // Listen for real-time dispatched notifications
  useEffect(() => {
    const handleNewNotification = (e: Event) => {
      const customEvent = e as CustomEvent<AppNotification>;
      if (customEvent.detail) {
        const notif = customEvent.detail;
        setNotifications((prev) => [notif, ...prev.filter((n) => n.id !== notif.id)]);
        setActiveToast(notif);
        // Play subtle browser audio click/beep if supported or haptic
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    };

    window.addEventListener('holiday_notification_event', handleNewNotification);
    return () => window.removeEventListener('holiday_notification_event', handleNewNotification);
  }, []);

  // Auto-dismiss active toast after 6 seconds
  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [activeToast]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const handleClearAll = () => {
    setNotifications([]);
    saveStoredNotifications([]);
  };

  const handleNotificationClick = (n: AppNotification) => {
    // Mark as read
    const updated = notifications.map((item) => (item.id === n.id ? { ...item, read: true } : item));
    setNotifications(updated);
    saveStoredNotifications(updated);

    if (n.bookingRef && onOpenTracker) {
      setIsOpen(false);
      onOpenTracker(n.bookingRef);
    }
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'payment_verified':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'receipt':
        return <Camera className="w-4 h-4 text-cyan-400" />;
      case 'audit_flag':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'booking':
        return <Ticket className="w-4 h-4 text-sunset-coral" />;
      default:
        return <Sparkles className="w-4 h-4 text-sand-muted" />;
    }
  };

  return (
    <>
      {/* Reactive Real-Time Floating Toast Alert */}
      {activeToast && (
        <div 
          className="fixed top-20 right-4 z-50 max-w-sm w-full bg-[#0D151D] border border-white/15 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto"
          role="alert"
          id="real-time-notification-toast"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
              {getIcon(activeToast.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-semibold text-ivory tracking-wide truncate">
                  {activeToast.title}
                </h4>
                <span className="text-[10px] font-mono text-sand-muted">{activeToast.timestamp}</span>
              </div>
              <p className="text-xs text-sand-muted mt-1 leading-relaxed">
                {activeToast.message}
              </p>

              {activeToast.bookingRef && onOpenTracker && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenTracker(activeToast.bookingRef);
                    setActiveToast(null);
                  }}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-sunset-coral hover:text-[#ff765b] transition-colors"
                >
                  <span>Track Ref #{activeToast.bookingRef}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-sand-muted hover:text-ivory transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Bell Trigger */}
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-full text-sand-muted hover:text-ivory hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
          title="Notifications & Booking Updates"
          id="real-time-notification-bell-btn"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-sunset-coral text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-lg shadow-sunset-coral/40 animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0B1015] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-2xl text-left space-y-3 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-sunset-coral" />
                <span className="text-xs font-semibold text-ivory tracking-wide">
                  Notifications & Travel Alerts
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-mono bg-sunset-coral/20 text-sunset-coral px-1.5 py-0.5 rounded border border-sunset-coral/30">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-sand-muted">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="hover:text-ivory transition-colors cursor-pointer"
                  >
                    Mark read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="hover:text-rose-400 transition-colors p-1 cursor-pointer"
                    title="Clear all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-sand-muted space-y-1">
                  <Bell className="w-6 h-6 mx-auto opacity-30 text-sand-muted" />
                  <p>No recent notifications.</p>
                  <p className="text-[10px] text-sand-muted/70">
                    Live updates on your bookings, receipts, and audits will appear here.
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all hover:border-white/20 ${
                      n.read
                        ? 'bg-white/[0.02] border-white/[0.05] text-sand-muted'
                        : 'bg-white/[0.06] border-white/15 text-ivory'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-medium text-[12px] truncate">{n.title}</p>
                          <span className="text-[10px] font-mono text-sand-muted shrink-0">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-sand-muted mt-0.5 leading-relaxed">
                          {n.message}
                        </p>
                        {n.bookingRef && (
                          <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-mono text-sunset-coral hover:underline">
                            <span>Ref: {n.bookingRef}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
