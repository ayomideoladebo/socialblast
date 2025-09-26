"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FiHome, 
  FiSmartphone, 
  FiWifi, 
  FiGift, 
  FiTrendingUp, 
  FiDollarSign, 
  FiHelpCircle, 
  FiSettings,
  FiLogOut
} from "react-icons/fi";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-gray-200 bg-white pt-16 dark:border-gray-700 dark:bg-gray-900 md:flex">
      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
        <nav className="flex-1 space-y-1">
          <Link
            href="/dashboard"
            className={`sidebar-link ${isActive("/dashboard") ? "active" : ""}`}
          >
            <FiHome className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard/phone-numbers"
            className={`sidebar-link ${isActive("/dashboard/phone-numbers") ? "active" : ""}`}
          >
            <FiSmartphone className="h-5 w-5" />
            <span>Phone Numbers</span>
          </Link>
          <Link
            href="/dashboard/esim"
            className={`sidebar-link ${isActive("/dashboard/esim") ? "active" : ""}`}
          >
            <FiWifi className="h-5 w-5" />
            <span>eSIM Marketplace</span>
          </Link>
          <Link
            href="/dashboard/gift-cards"
            className={`sidebar-link ${isActive("/dashboard/gift-cards") ? "active" : ""}`}
          >
            <FiGift className="h-5 w-5" />
            <span>Gift Card Market</span>
          </Link>
          <Link
            href="/dashboard/smm"
            className={`sidebar-link ${isActive("/dashboard/smm") ? "active" : ""}`}
          >
            <FiTrendingUp className="h-5 w-5" />
            <span>SMM Services</span>
          </Link>
          <Link
            href="/dashboard/wallet"
            className={`sidebar-link ${isActive("/dashboard/wallet") ? "active" : ""}`}
          >
            <FiDollarSign className="h-5 w-5" />
            <span>Wallet</span>
          </Link>
          <Link
            href="/dashboard/support"
            className={`sidebar-link ${isActive("/dashboard/support") ? "active" : ""}`}
          >
            <FiHelpCircle className="h-5 w-5" />
            <span>Support</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className={`sidebar-link ${isActive("/dashboard/settings") ? "active" : ""}`}
          >
            <FiSettings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
      <div className="border-t border-gray-200 px-3 py-4 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
        >
          <FiLogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}