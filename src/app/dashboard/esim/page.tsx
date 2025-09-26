"use client";

import { useState, useEffect } from "react";
import { FiWifi, FiGlobe, FiShoppingCart, FiInfo } from "react-icons/fi";
import { supabase } from "@/lib/supabase";

type ESim = {
  id: string;
  country: string;
  provider: string;
  data_amount: string;
  validity_days: number;
  price: number;
  description: string;
  country_code: string;
};

export default function ESimPage() {
  const [esims, setEsims] = useState<ESim[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedESim, setSelectedESim] = useState<ESim | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    fetchESims();
  }, []);

  const fetchESims = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('esims')
        .select('*');
        
      if (error) throw error;
      
      setEsims(data || []);
      
      // Extract unique countries
      const uniqueCountries = [...new Set(data?.map(esim => esim.country) || [])];
      setCountries(uniqueCountries);
    } catch (error) {
      console.error('Error fetching eSIMs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseESim = async (esim: ESim) => {
    try {
      setPurchasing(true);
      
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
      
      // Check if user has enough balance
      if (userData.wallet_balance < esim.price) {
        alert('Insufficient balance. Please top up your wallet.');
        return;
      }
      
      // Create order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          order_type: 'esim',
          amount: esim.price,
          status: 'completed',
          details: { esim_id: esim.id }
        });
        
      if (orderError) throw orderError;
      
      // Update user wallet balance
      const { error: walletError } = await supabase
        .from('users')
        .update({ 
          wallet_balance: userData.wallet_balance - esim.price 
        })
        .eq('id', session.user.id);
        
      if (walletError) throw walletError;
      
      alert('eSIM purchased successfully! Check your email for activation instructions.');
      
    } catch (error) {
      console.error('Error purchasing eSIM:', error);
      alert('Failed to purchase eSIM. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const filteredESims = esims.filter(esim => {
    // Filter by country if not "all"
    if (filter !== "all" && esim.country !== filter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      return (
        esim.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        esim.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        esim.data_amount.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">eSIM Marketplace</h1>
        <button 
          onClick={fetchESims}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <FiWifi className="mr-2 h-4 w-4" />
          Refresh Plans
        </button>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-1 items-center space-x-4">
            <div className="w-full max-w-xs">
              <input
                type="text"
                placeholder="Search country, provider or data amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : filteredESims.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredESims.map((esim) => (
              <div 
                key={esim.id} 
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="bg-indigo-600 p-4 text-white dark:bg-indigo-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-2 text-lg">{esim.country_code}</span>
                      <h3 className="text-lg font-semibold">{esim.country}</h3>
                    </div>
                    <FiGlobe className="h-6 w-6" />
                  </div>
                  <p className="mt-1 text-sm text-indigo-100">{esim.provider}</p>
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Data</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{esim.data_amount}</span>
                    </div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Validity</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{esim.validity_days} days</span>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</span>
                      <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">${esim.price.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4 rounded-md bg-gray-50 p-3 dark:bg-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{esim.description}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedESim(esim)}
                      className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      <div className="flex items-center justify-center">
                        <FiInfo className="mr-2 h-4 w-4" />
                        Details
                      </div>
                    </button>
                    <button
                      onClick={() => handlePurchaseESim(esim)}
                      disabled={purchasing}
                      className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    >
                      <div className="flex items-center justify-center">
                        <FiShoppingCart className="mr-2 h-4 w-4" />
                        Buy Now
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center">
            <p className="mb-2 text-lg text-gray-500 dark:text-gray-400">No eSIM plans available</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Try changing your filters or check back later</p>
          </div>
        )}
      </div>
      
      {selectedESim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedESim.country} eSIM Details
              </h2>
              <button
                onClick={() => setSelectedESim(null)}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4 rounded-md bg-indigo-50 p-4 dark:bg-indigo-900/20">
              <div className="mb-2 flex items-center">
                <FiGlobe className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-medium text-gray-900 dark:text-white">{selectedESim.provider}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedESim.data_amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Validity</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedESim.validity_days} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="font-bold text-indigo-600 dark:text-indigo-400">${selectedESim.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="mb-2 font-medium text-gray-900 dark:text-white">Description</h3>
              <p className="text-gray-600 dark:text-gray-300">{selectedESim.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="mb-2 font-medium text-gray-900 dark:text-white">Activation Instructions</h3>
              <ol className="ml-4 list-decimal space-y-2 text-gray-600 dark:text-gray-300">
                <li>After purchase, you will receive a QR code via email</li>
                <li>Go to your phone settings and select "Add eSIM"</li>
                <li>Scan the QR code with your phone camera</li>
                <li>Follow the on-screen instructions to activate</li>
                <li>Once activated, select the new plan as your data connection</li>
              </ol>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => {
                  handlePurchaseESim(selectedESim);
                  setSelectedESim(null);
                }}
                disabled={purchasing}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <FiShoppingCart className="mr-2 h-4 w-4" />
                Purchase Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}