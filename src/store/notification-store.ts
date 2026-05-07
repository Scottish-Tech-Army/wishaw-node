import { create } from 'zustand';
import api from '../services/api';
import type { Notification } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const data = await api.getNotifications();
      set({ notifications: data.notifications, unreadCount: data.unreadCount });
    } catch { /* ignore */ }
  },

  markRead: async (id) => {
    await api.markNotificationRead(id);
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllRead: async () => {
    await api.markAllNotificationsRead();
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },
}));
