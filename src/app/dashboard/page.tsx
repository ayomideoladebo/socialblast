"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FiSmartphone, 
  FiWifi, 
  FiGift, 
  FiTrendingUp, 
  FiDollarSign,
  FiClock,
  FiShoppingBag,
  FiArrowRight
} from "react-icons/fi";
import { supabase } from "@/lib/supabase";
import { User } from "@/lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.id) {
          // Fetch user profile
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userError) throw userError;
          setUser(userData);
          
          // Fetch recent orders
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(5);
          
          if (orderError) throw orderError;
          setRecentOrders(orderData || []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Welcome back, {user?.full_name || 'User'}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                <FiDollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Wallet Balance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${user?.wallet_balance?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
            <Link 
              href="/dashboard/wallet" 
              className="mt-3 flex items-center text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Add funds <FiArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900 dark:text-green-300">
                <FiShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {recentOrders.filter(order => order.status === 'pending').length || 0}
                </p>
              </div>
            </div>
            <Link 
              href="/dashboard/orders" 
              className="mt-3 flex items-center text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              View orders <FiArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-purple-100 p-3 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                <FiClock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/dashboard/phone-numbers" 
              className="flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <FiSmartphone className="mb-2 h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="text-center text-sm font-medium text-gray-900 dark:text-white">Buy Phone Number</span>
            </Link>
            
            <Link 
              href="/dashboard/esim" 
              className="flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <FiWifi className="mb-2 h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="text-center text-sm font-medium text-gray-900 dark:text-white">Get eSIM</span>
            </Link>
            
            <Link 
              href="/dashboard/gift-cards" 
              className="flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <FiGift className="mb-2 h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="text-center text-sm font-medium text-gray-900 dark:text-white">Gift Cards</span>
            </Link>
            
            <Link 
              href="/dashboard/smm" 
              className="flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <FiTrendingUp className="mb-2 h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="text-center text-sm font-medium text-gray-900 dark:text-white">SMM Services</span>
            </Link>
          </div>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="mr-3 rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                      {order.order_type === 'phone_number' && <FiSmartphone className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
                      {order.order_type === 'esim' && <FiWifi className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
                      {order.order_type === 'gift_card' && <FiGift className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
                      {order.order_type === 'smm' && <FiTrendingUp className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.order_type.replace('_', ' ').charAt(0).toUpperCase() + order.order_type.replace('_', ' ').slice(1)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}