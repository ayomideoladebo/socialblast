"use client";

import { useState, useEffect } from "react";
import { FiGift, FiPlus, FiShoppingCart, FiFilter, FiRefreshCw } from "react-icons/fi";
import { supabase } from "@/lib/supabase";

type GiftCard = {
  id: string;
  seller_id: string;
  seller_name: string;
  card_type: string;
  value: number;
  price: number;
  currency: string;
  status: 'available' | 'pending' | 'sold';
  created_at: string;
};

export default function GiftCardsPage() {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cardTypes, setCardTypes] = useState<string[]>([]);
  
  // New gift card form state
  const [newCard, setNewCard] = useState({
    card_type: "Amazon",
    value: 50,
    price: 45,
    currency: "USD",
    code: ""
  });

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const fetchGiftCards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('status', 'available');
        
      if (error) throw error;
      
      setGiftCards(data || []);
      
      // Extract unique card types
      const uniqueCardTypes = [...new Set(data?.map(card => card.card_type) || [])];
      setCardTypes(uniqueCardTypes);
    } catch (error) {
      console.error('Error fetching gift cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseCard = async (card: GiftCard) => {
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
      if (userData.wallet_balance < card.price) {
        alert('Insufficient balance. Please top up your wallet.');
        return;
      }
      
      // Update card status to pending (escrow)
      const { error: updateError } = await supabase
        .from('gift_cards')
        .update({ 
          status: 'pending',
          buyer_id: session.user.id
        })
        .eq('id', card.id);
        
      if (updateError) throw updateError;
      
      // Create order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          order_type: 'gift_card',
          amount: card.price,
          status: 'pending',
          details: { gift_card_id: card.id }
        });
        
      if (orderError) throw orderError;
      
      // Update user wallet balance (hold funds in escrow)
      const { error: walletError } = await supabase
        .from('users')
        .update({ 
          wallet_balance: userData.wallet_balance - card.price,
          escrow_balance: (userData.escrow_balance || 0) + card.price
        })
        .eq('id', session.user.id);
        
      if (walletError) throw walletError;
      
      alert('Gift card purchase initiated! The code will be revealed once the seller confirms the transaction.');
      fetchGiftCards();
      
    } catch (error) {
      console.error('Error purchasing gift card:', error);
      alert('Failed to purchase gift card. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleSellCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      
      // Get user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', session.user.id)
        .single();
        
      if (userError) throw userError;
      
      // Create new gift card listing
      const { error: cardError } = await supabase
        .from('gift_cards')
        .insert({
          seller_id: session.user.id,
          seller_name: userData.full_name,
          card_type: newCard.card_type,
          value: newCard.value,
          price: newCard.price,
          currency: newCard.currency,
          status: 'available',
          code: newCard.code // This will be encrypted in a real implementation
        });
        
      if (cardError) throw cardError;
      
      alert('Gift card listed successfully!');
      setShowSellModal(false);
      setNewCard({
        card_type: "Amazon",
        value: 50,
        price: 45,
        currency: "USD",
        code: ""
      });
      fetchGiftCards();
      
    } catch (error) {
      console.error('Error listing gift card:', error);
      alert('Failed to list gift card. Please try again.');
    }
  };

  const filteredCards = giftCards.filter(card => {
    // Filter by card type if not "all"
    if (filter !== "all" && card.card_type !== filter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      return (
        card.card_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.seller_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gift Card Marketplace</h1>
        <div className="flex space-x-3">
          <button 
            onClick={fetchGiftCards}
            className="inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <FiRefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
          <button 
            onClick={() => setShowSellModal(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Sell Gift Card
          </button>
        </div>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-1 items-center space-x-4">
            <div className="w-full max-w-xs">
              <input
                type="text"
                placeholder="Search card type or seller..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FiFilter className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Card Types</option>
                {cardTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : filteredCards.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCards.map((card) => (
              <div 
                key={card.id} 
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{card.card_type}</h3>
                    <FiGift className="h-6 w-6" />
                  </div>
                  <p className="mt-1 text-sm text-purple-100">Sold by: {card.seller_name}</p>
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Card Value</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {card.currency} {card.value.toFixed(2)}
                      </span>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Selling Price</span>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        {card.currency} {card.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Discount</span>
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        {Math.round((1 - card.price / card.value) * 100)}% off
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4 rounded-md bg-gray-50 p-3 dark:bg-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Listed on {new Date(card.created_at).toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Secure escrow payment - funds released when code is verified
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handlePurchaseCard(card)}
                    disabled={purchasing}
                    className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    <div className="flex items-center justify-center">
                      <FiShoppingCart className="mr-2 h-4 w-4" />
                      Buy Now
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center">
            <p className="mb-2 text-lg text-gray-500 dark:text-gray-400">No gift cards available</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Be the first to sell a gift card or check back later
            </p>
            <button
              onClick={() => setShowSellModal(true)}
              className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Sell Gift Card
            </button>
          </div>
        )}
      </div>
      
      {/* Sell Gift Card Modal */}
      {showSellModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Sell Gift Card
              </h2>
              <button
                onClick={() => setShowSellModal(false)}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSellCard}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gift Card Type
                </label>
                <select
                  value={newCard.card_type}
                  onChange={(e) => setNewCard({...newCard, card_type: e.target.value})}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="Amazon">Amazon</option>
                  <option value="Apple">Apple</option>
                  <option value="Google Play">Google Play</option>
                  <option value="Steam">Steam</option>
                  <option value="Xbox">Xbox</option>
                  <option value="PlayStation">PlayStation</option>
                  <option value="Netflix">Netflix</option>
                  <option value="Spotify">Spotify</option>
                  <option value="Uber">Uber</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Card Value
                </label>
                <div className="flex">
                  <select
                    value={newCard.currency}
                    onChange={(e) => setNewCard({...newCard, currency: e.target.value})}
                    className="rounded-l-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <input
                    type="number"
                    value={newCard.value}
                    onChange={(e) => setNewCard({...newCard, value: parseFloat(e.target.value)})}
                    className="w-full rounded-r-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Selling Price
                </label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
                    {newCard.currency}
                  </span>
                  <input
                    type="number"
                    value={newCard.price}
                    onChange={(e) => setNewCard({...newCard, price: parseFloat(e.target.value)})}
                    className="w-full rounded-r-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    min="1"
                    max={newCard.value}
                    step="0.01"
                    required
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Discount: {Math.round((1 - newCard.price / newCard.value) * 100)}% off
                </p>
              </div>
              
              <div className="mb-6">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gift Card Code
                </label>
                <textarea
                  value={newCard.code}
                  onChange={(e) => setNewCard({...newCard, code: e.target.value})}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Enter the gift card code here. It will be securely stored and only revealed to the buyer after payment."
                  required
                />
              </div>
              
              <div className="mb-6 rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> By listing this gift card, you confirm that it is valid and unused. 
                  Fraudulent listings will result in account suspension.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSellModal(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  List Gift Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}