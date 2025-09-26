"use client";

import { useState, useEffect } from "react";
import { FiTrendingUp, FiShoppingCart, FiFilter, FiInstagram, FiYoutube, FiTwitter, FiFacebook } from "react-icons/fi";
import { TbBrandTiktok } from "react-icons/tb";
import { supabase } from "@/lib/supabase";

type SMMService = {
  id: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'facebook';
  service_type: string;
  name: string;
  description: string;
  min_quantity: number;
  max_quantity: number;
  price_per_1000: number;
  average_time: string;
};

export default function SMMServicesPage() {
  const [services, setServices] = useState<SMMService[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [selectedService, setSelectedService] = useState<SMMService | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [link, setLink] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('smm_services')
        .select('*');
        
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching SMM services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService) return;
    
    try {
      setOrdering(true);
      
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      
      // Get user data to check wallet balance
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('wallet_balance')
        .eq('id', session.user.id)
        .single();
        
      if (userError) throw userError;
      
      // Calculate order cost
      const orderCost = (selectedService.price_per_1000 / 1000) * quantity;
      
      // Check if user has enough balance
      if (userData.wallet_balance < orderCost) {
        alert('Insufficient balance. Please top up your wallet.');
        return;
      }
      
      // Create order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          order_type: 'smm',
          amount: orderCost,
          status: 'pending',
          details: { 
            service_id: selectedService.id,
            service_name: selectedService.name,
            platform: selectedService.platform,
            quantity: quantity,
            link: link
          }
        });
        
      if (orderError) throw orderError;
      
      // Update user wallet balance
      const { error: walletError } = await supabase
        .from('users')
        .update({ 
          wallet_balance: userData.wallet_balance - orderCost 
        })
        .eq('id', session.user.id);
        
      if (walletError) throw walletError;
      
      alert('Order placed successfully! You can track its progress in your orders.');
      setSelectedService(null);
      setQuantity(0);
      setLink("");
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setOrdering(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <FiInstagram className="h-5 w-5" />;
      case 'tiktok':
        return <TbBrandTiktok className="h-5 w-5" />;
      case 'youtube':
        return <FiYoutube className="h-5 w-5" />;
      case 'twitter':
        return <FiTwitter className="h-5 w-5" />;
      case 'facebook':
        return <FiFacebook className="h-5 w-5" />;
      default:
        return <FiTrendingUp className="h-5 w-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return 'from-purple-500 to-pink-500';
      case 'tiktok':
        return 'from-black to-gray-800';
      case 'youtube':
        return 'from-red-600 to-red-700';
      case 'twitter':
        return 'from-blue-400 to-blue-500';
      case 'facebook':
        return 'from-blue-600 to-blue-700';
      default:
        return 'from-indigo-500 to-indigo-600';
    }
  };

  const filteredServices = services.filter(service => {
    // Filter by platform if not "all"
    if (platformFilter !== "all" && service.platform !== platformFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      return (
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.service_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SMM Services</h1>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-1 items-center space-x-4">
            <div className="w-full max-w-xs">
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FiFilter className="h-5 w-5 text-gray-400" />
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <div 
                key={service.id} 
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div className={`bg-gradient-to-r ${getPlatformColor(service.platform)} p-4 text-white`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    {getPlatformIcon(service.platform)}
                  </div>
                  <p className="mt-1 text-sm text-white/80">
                    {service.platform.charAt(0).toUpperCase() + service.platform.slice(1)} • {service.service_type}
                  </p>
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                      {service.description}
                    </p>
                    
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Price per 1000</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${service.price_per_1000.toFixed(2)}
                      </span>
                    </div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Min Order</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {service.min_quantity}
                      </span>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Time</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {service.average_time}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setQuantity(service.min_quantity);
                    }}
                    className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    <div className="flex items-center justify-center">
                      <FiShoppingCart className="mr-2 h-4 w-4" />
                      Order Now
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center">
            <p className="mb-2 text-lg text-gray-500 dark:text-gray-400">No services found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Try changing your filters or search query
            </p>
          </div>
        )}
      </div>
      
      {/* Order Service Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Order {selectedService.name}
              </h2>
              <button
                onClick={() => setSelectedService(null)}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4 rounded-md bg-gray-50 p-4 dark:bg-gray-700">
              <div className="flex items-center">
                {getPlatformIcon(selectedService.platform)}
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {selectedService.platform.charAt(0).toUpperCase() + selectedService.platform.slice(1)} • {selectedService.service_type}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {selectedService.description}
              </p>
            </div>
            
            <form onSubmit={handleOrderService}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Link
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder={`Enter your ${selectedService.platform} link`}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= selectedService.min_quantity && value <= selectedService.max_quantity) {
                      setQuantity(value);
                    }
                  }}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  min={selectedService.min_quantity}
                  max={selectedService.max_quantity}
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Min: {selectedService.min_quantity} - Max: {selectedService.max_quantity}
                </p>
              </div>
              
              <div className="mb-6 rounded-md bg-indigo-50 p-4 dark:bg-indigo-900/20">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Total Price:</span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    ${((selectedService.price_per_1000 / 1000) * quantity).toFixed(2)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Estimated delivery time: {selectedService.average_time}
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ordering}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}