import { AppNotification } from '../types';

const NOTIFICATIONS_STORAGE_KEY = 'holiday_app_notifications';

export const getStoredNotifications = (): AppNotification[] => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load notifications from storage:', err);
    return [];
  }
};

export const saveStoredNotifications = (notifications: AppNotification[]): void => {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications.slice(0, 50)));
  } catch (err) {
    console.error('Failed to save notifications to storage:', err);
  }
};

export const dispatchAppNotification = (
  data: Omit<AppNotification, 'id' | 'timestamp' | 'read'>
): AppNotification => {
  const newNotification: AppNotification = {
    ...data,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: false
  };

  const current = getStoredNotifications();
  const updated = [newNotification, ...current];
  saveStoredNotifications(updated);

  // Dispatch custom window event for real-time reactivity across components
  window.dispatchEvent(
    new CustomEvent('holiday_notification_event', {
      detail: newNotification
    })
  );

  return newNotification;
};
