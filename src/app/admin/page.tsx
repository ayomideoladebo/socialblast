"use client";

import { useState, useEffect } from "react";
import { FiUsers, FiPhone, FiWifi, FiGift, FiTrendingUp, FiDollarSign, FiMessageSquare } from "react-icons/fi";
import { supabase } from "@/lib/supabase";

type DashboardStats = {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  phoneNumbersSold: number;
  esimsSold: number;
  giftCardsSold: number;
  smmOrdersCompleted: number;
  openSupportTickets: number;
};

type RevenueData = {
  date: string;
  amount: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    phoneNumbersSold: 0,
    esimsSold: 0,
    giftCardsSold: 0,
    smmOrdersCompleted: 0,
    openSupportTickets: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, we would fetch actual data from Supabase
      // For demo purposes, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock dashboard stats
      setStats({
        totalUsers: 1250,
        activeUsers: 487,
        totalRevenue: 28750.50,
        phoneNumbersSold: 3240,
        esimsSold: 856,
        giftCardsSold: 1432,
        smmOrdersCompleted: 2567,
        openSupportTickets: 18,
      });
      
      // Mock revenue data for the last 7 days
      const mockRevenueData: RevenueData[] = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        mockRevenueData.push({
          date: date.toISOString().split('T')[0],
          amount: Math.floor(Math.random() * 2000) + 500,
        });
      }
      
      setRevenueData(mockRevenueData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
              <FiUsers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-green-600 dark:text-green-400">+12%</span> from last month
          </p>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900 dark:text-green-300">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-green-600 dark:text-green-400">+8.5%</span> from last month
          </p>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
              <FiUsers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeUsers}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-green-600 dark:text-green-400">+5.2%</span> from last week
          </p>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-yellow-100 p-3 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
              <FiMessageSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.openSupportTickets}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-red-600 dark:text-red-400">+3</span> from yesterday
          </p>
        </div>
      </div>
      
      {/* Revenue Chart */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Revenue (Last 7 Days)</h2>
        <div className="h-64">
          <div className="flex h-full items-end">
            {revenueData.map((data, index) => (
              <div key={index} className="relative flex h-full flex-1 flex-col items-center justify-end">
                <div 
                  className="w-full bg-indigo-600 dark:bg-indigo-500" 
                  style={{ 
                    height: `${(data.amount / 2500) * 100}%`,
                    maxHeight: '90%',
                    minHeight: '10%'
                  }}
                ></div>
                <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">{formatDate(data.date)}</span>
                <div className="absolute bottom-full mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                  ${data.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Service Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Numbers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.phoneNumbersSold}</p>
            </div>
            <div className="rounded-full bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
              <FiPhone className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Total numbers sold</p>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">eSIM Plans</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.esimsSold}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
              <FiWifi className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Total eSIMs sold</p>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gift Cards</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.giftCardsSold}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900 dark:text-green-300">
              <FiGift className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Total cards traded</p>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">SMM Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.smmOrdersCompleted}</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
              <FiTrendingUp className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Total orders completed</p>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            <li className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    <FiUsers className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">New user registered</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">john.doe@example.com</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">5 minutes ago</span>
              </div>
            </li>
            <li className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900 dark:text-green-300">
                    <FiDollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Payment received</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">$125.00 from sarah.smith@example.com</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">15 minutes ago</span>
              </div>
            </li>
            <li className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                    <FiTrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">New SMM order</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">1000 Instagram followers for @techuser</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">32 minutes ago</span>
              </div>
            </li>
            <li className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-yellow-100 p-2 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
                    <FiMessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">New support ticket</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Issue with eSIM activation</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">1 hour ago</span>
              </div>
            </li>
            <li className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-900 dark:text-red-300">
                    <FiGift className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Gift card dispute</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Amazon $50 card - needs review</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}