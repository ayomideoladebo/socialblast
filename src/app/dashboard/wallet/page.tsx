"use client";

import { useState, useEffect } from "react";
import { FiDollarSign, FiCreditCard, FiPlus, FiClock, FiArrowDown, FiArrowUp } from "react-icons/fi";
import { supabase } from "@/lib/supabase";
import { loadStripe } from "@stripe/stripe-js";

type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'purchase';
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
  description: string;
};

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(50);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      
      // Get user wallet balance
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('wallet_balance')
        .eq('id', session.user.id)
        .single();
        
      if (userError) throw userError;
      setBalance(userData.wallet_balance || 0);
      
      // Get transaction history
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (transactionError) throw transactionError;
      setTransactions(transactionData || []);
      
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    try {
      setProcessingPayment(true);
      
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      
      // In a real implementation, we would create a Stripe checkout session here
      // For demo purposes, we'll simulate a successful payment
      
      // Create a transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: session.user.id,
          amount: depositAmount,
          type: 'deposit',
          status: 'completed',
          description: `Wallet deposit of $${depositAmount.toFixed(2)}`
        });
        
      if (transactionError) throw transactionError;
      
      // Update user wallet balance
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('wallet_balance')
        .eq('id', session.user.id)
        .single();
        
      if (userError) throw userError;
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          wallet_balance: (userData.wallet_balance || 0) + depositAmount 
        })
        .eq('id', session.user.id);
        
      if (updateError) throw updateError;
      
      alert('Deposit successful! Your wallet has been credited.');
      setShowDepositModal(false);
      fetchWalletData();
      
    } catch (error) {
      console.error('Error processing deposit:', error);
      alert('Failed to process deposit. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <FiArrowDown className="h-5 w-5 text-green-500" />;
      case 'withdrawal':
        return <FiArrowUp className="h-5 w-5 text-red-500" />;
      case 'purchase':
        return <FiCreditCard className="h-5 w-5 text-indigo-500" />;
      default:
        return <FiClock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wallet</h1>
        <button 
          onClick={() => setShowDepositModal(true)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Add Funds
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Balance</h2>
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
              <FiDollarSign className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Available Balance</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${balance.toFixed(2)}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowDepositModal(true)}
            className="mt-6 w-full rounded-md border border-indigo-600 bg-transparent px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
          >
            <div className="flex items-center justify-center">
              <FiPlus className="mr-2 h-4 w-4" />
              Add Funds
            </div>
          </button>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
              <FiCreditCard className="mx-auto mb-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Payment Methods</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Manage your cards</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
              <FiClock className="mx-auto mb-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Transaction History</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">View all transactions</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
        
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        {getTransactionIcon(transaction.type)}
                        <span className="ml-2 capitalize text-gray-900 dark:text-white">
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {transaction.description}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <span className={`${
                        transaction.type === 'deposit' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center">
            <p className="mb-2 text-lg text-gray-500 dark:text-gray-400">No transactions yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Add funds to your wallet to get started
            </p>
            <button
              onClick={() => setShowDepositModal(true)}
              className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Add Funds
            </button>
          </div>
        )}
      </div>
      
      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Funds to Wallet
              </h2>
              <button
                onClick={() => setShowDepositModal(false)}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount to Add
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 dark:text-gray-400">$</span>
                </div>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Math.max(10, parseInt(e.target.value) || 0))}
                  className="block w-full rounded-md border border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  placeholder="0.00"
                  min="10"
                  step="5"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <label htmlFor="currency" className="sr-only">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 dark:text-gray-400 sm:text-sm"
                  >
                    <option>USD</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select a quick amount:
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[10, 25, 50, 100, 200, 500].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setDepositAmount(amount)}
                    className={`rounded-md border px-4 py-2 text-sm font-medium ${
                      depositAmount === amount
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <div className="rounded-md bg-indigo-50 p-4 dark:bg-indigo-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiCreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Payment Information</h3>
                    <div className="mt-2 text-sm text-indigo-700 dark:text-indigo-400">
                      <p>
                        For demo purposes, clicking "Add Funds" will simulate a successful payment.
                        In a production environment, this would connect to Stripe or Paystack.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDepositModal(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeposit}
                disabled={processingPayment || depositAmount < 10}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                {processingPayment ? 'Processing...' : 'Add Funds'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}