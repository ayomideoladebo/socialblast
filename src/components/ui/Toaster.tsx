"use client";

import { Toaster as HotToaster } from 'react-hot-toast';
import { useTheme } from 'next-themes';

export default function Toaster() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: isDark ? '#1e1e2d' : '#ffffff',
          color: isDark ? '#ffffff' : '#1e1e2d',
          border: `1px solid ${isDark ? '#2d2d3d' : '#e2e8f0'}`,
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: isDark ? '#1e1e2d' : '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: isDark ? '#1e1e2d' : '#ffffff',
          },
        },
      }}
    />
  );
}