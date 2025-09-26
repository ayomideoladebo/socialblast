"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FiMenu, FiX, FiHome, FiUsers, FiPhone, FiWifi, FiGift, FiTrendingUp, 
  FiMessageSquare, FiSettings, FiLogOut, FiBarChart2 } from "react-icons/fi";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      
      // Check if user is admin
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (userError) throw userError;
      
      if (userData?.role !== 'admin') {
        // Redirect non-admin users to dashboard
        router.push('/dashboard');
        return;
      }
      
      setIsAdmin(true);
      
    } catch (error) {
      console.error('Error checking admin status:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: FiBarChart2 },
    { name: 'Users', href: '/admin/users', icon: FiUsers },
    { name: 'Phone Numbers', href: '/admin/phone-numbers', icon: FiPhone },
    { name: 'eSIM', href: '/admin/esim', icon: FiWifi },
    { name: 'Gift Cards', href: '/admin/gift-cards', icon: FiGift },
    { name: 'SMM Services', href: '/admin/smm', icon: FiTrendingUp },
    { name: 'Support Tickets', href: '/admin/support', icon: FiMessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-1 flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-shrink-0 items-center px-4">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">SocialBlast Admin</span>
          </div>
          <div className="mt-5 flex flex-1 flex-col">
            <nav className="flex-1 space-y-1 px-2 pb-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-300'
                          : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={handleSignOut}
                className="group mt-4 flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <FiLogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 dark:bg-gray-800">
              <div className="absolute right-0 top-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <FiX className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex flex-shrink-0 items-center px-4">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">SocialBlast Admin</span>
              </div>
              <div className="mt-5 flex flex-1 flex-col overflow-y-auto">
                <nav className="flex-1 space-y-1 px-2 pb-4">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                          isActive
                            ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon
                          className={`mr-3 h-5 w-5 flex-shrink-0 ${
                            isActive
                              ? 'text-indigo-600 dark:text-indigo-300'
                              : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                          }`}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                  <button
                    onClick={handleSignOut}
                    className="group mt-4 flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <FiLogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300" />
                    Sign Out
                  </button>
                </nav>
              </div>
            </div>
            <div className="w-14 flex-shrink-0">{/* Force sidebar to shrink to fit close icon */}</div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow dark:bg-gray-800">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden dark:border-gray-700 dark:text-gray-400"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <FiMenu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Panel</h1>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}