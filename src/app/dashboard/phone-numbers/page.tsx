"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FiSearch, FiRefreshCw, FiCopy, FiShoppingCart, FiMessageSquare, FiX, FiFilter, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { toast } from "react-hot-toast";
import * as FiveSimAPI from "@/lib/5sim";

// Import Modal with SSR disabled to avoid hydration issues
const Modal = dynamic(() => import("@/components/ui/Modal"), { ssr: false });

// Using the PhoneNumber type from 5Sim API with some additional fields
type PhoneNumber = FiveSimAPI.PhoneNumber & {
  status: "available" | "purchased";
};

type SMSMessage = {
  id: string;
  phone_number_id: string;
  sender: string;
  message: string;
  received_at: string;
};

export default function PhoneNumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  // SMS Messages
  const [selectedNumber, setSelectedNumber] = useState<PhoneNumber | null>(null);
  const [messages, setMessages] = useState<SMSMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);

  useEffect(() => {
    fetchPhoneNumbers();
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchServices(selectedCountry);
    }
  }, [selectedCountry]);

  const fetchPhoneNumbers = async () => {
    try {
      setLoading(true);
      
      // Get purchased numbers from 5Sim API
      const purchasedNumbers = await FiveSimAPI.getPurchasedNumbers();
      
      // Map to our PhoneNumber type
      const numbers = purchasedNumbers.map(number => ({
        ...number,
        status: "purchased" as const
      }));
      
      setPhoneNumbers(numbers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching phone numbers:", error);
      toast.error("Failed to fetch phone numbers");
      setLoading(false);
    }
  };

  // Purchase a new phone number
  const purchaseNumber = async () => {
    if (!selectedCountry || !selectedService) {
      toast.error("Please select a country and service");
      return;
    }

    try {
      setPurchasing(true);
      // Use any operator for now
      const result = await FiveSimAPI.purchaseNumber(selectedCountry, "any", selectedService);
      
      // Add the new number to the list
      setPhoneNumbers(prev => [
        {
          ...result,
          status: "purchased" as const
        },
        ...prev
      ]);
      
      toast.success(`Successfully purchased number: ${result.phone}`);
      setShowPurchaseModal(false);
    } catch (error) {
      console.error("Error purchasing number:", error);
      toast.error("Failed to purchase number");
    } finally {
      setPurchasing(false);
    }
  };

  // Fetch SMS messages for a phone number
  const fetchMessages = async (number: PhoneNumber) => {
    try {
      setLoadingMessages(true);
      setSelectedNumber(number);
      setShowMessagesModal(true);
      
      const smsMessages = await FiveSimAPI.getSMSMessages(number.id);
      
      // Map to our SMSMessage type
      const messages: SMSMessage[] = smsMessages.map(sms => ({
        id: sms.id,
        phone_number_id: number.id,
        sender: sms.sender,
        message: sms.text,
        received_at: sms.date
      }));
      
      setMessages(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleViewMessages = (phoneNumber: PhoneNumber) => {
    setSelectedNumber(phoneNumber);
    fetchMessages(phoneNumber);
    setShowMessagesModal(true);
  };

  const fetchCountries = async () => {
    try {
      const countries = await FiveSimAPI.getCountries();
      setCountries(countries);
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error("Failed to fetch countries");
    }
  };

  const fetchServices = async (country: string) => {
    try {
      const services = await FiveSimAPI.getServices(country);
      setServices(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services");
    }
  };



  const handlePurchase = async (phoneNumber: PhoneNumber) => {
    alert(`Purchased ${phoneNumber.number} for $${phoneNumber.price}`);
    
    // Remove the purchased number from the list
    setPhoneNumbers(prevNumbers => 
      prevNumbers.filter(num => num.id !== phoneNumber.id)
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show a toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out';
    toast.textContent = 'Copied to clipboard!';
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2000);
  };

  const resetFilters = () => {
    setSelectedCountry(null);
    setSelectedService(null);
    setSearchTerm("");
  };

  const filteredNumbers = phoneNumbers.filter(number => {
    const matchesSearch = searchTerm === "" || 
      number.phone.includes(searchTerm) || 
      number.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      number.product.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = selectedCountry === null || number.country === selectedCountry;
    const matchesService = selectedService === null || number.product === selectedService;
    
    return matchesSearch && matchesCountry && matchesService;
  });

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Temporary Phone Numbers</h1>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <FiFilter className="mr-2 h-4 w-4" />
              Filters
            </button>
            
            <button
              onClick={fetchPhoneNumbers}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <FiRefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </button>
            
            <button
              onClick={() => setShowPurchaseModal(true)}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
            >
              <FiShoppingCart className="mr-2 h-4 w-4" />
              Buy Number
            </button>
          </div>
        </div>
        
        <div className="relative mb-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="Search by country, service, or number..."
          />
        </div>
        
        {showFilters && (
          <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-700 mb-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Filters</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Reset all
              </button>
            </div>
            
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country
                </label>
                <select
                  value={selectedCountry || ""}
                  onChange={(e) => setSelectedCountry(e.target.value || null)}
                  className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-600 dark:text-white"
                >
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Service
                </label>
                <select
                  value={selectedService || ""}
                  onChange={(e) => setSelectedService(e.target.value || null)}
                  className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-600 dark:text-white"
                >
                  <option value="">All Services</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : filteredNumbers.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <p className="text-lg font-medium text-gray-900 dark:text-white">No phone numbers found</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try changing your search or filters
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Country
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {filteredNumbers.map((phoneNumber) => (
                  <tr key={phoneNumber.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {phoneNumber.country}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex items-center">
                        {phoneNumber.phone}
                        <button
                          onClick={() => copyToClipboard(phoneNumber.phone)}
                          className="ml-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
                          title="Copy to clipboard"
                        >
                          <FiCopy className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {phoneNumber.product}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      <span className="font-medium text-gray-900 dark:text-white">${phoneNumber.price.toFixed(2)}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewMessages(phoneNumber)}
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <FiMessageSquare className="mr-1 h-3 w-3" />
                          Messages
                        </button>
                        <button
                          onClick={() => handlePurchase(phoneNumber)}
                          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                        >
                          <FiShoppingCart className="mr-1 h-3 w-3" />
                          Purchase
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Purchase Modal */}
      <Modal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        title="Purchase New Phone Number"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Country
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              value={selectedCountry || ""}
              onChange={(e) => setSelectedCountry(e.target.value || null)}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
      
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Service
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              value={selectedService || ""}
              onChange={(e) => setSelectedService(e.target.value || null)}
              disabled={!selectedCountry}
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
      
          <div className="flex justify-end pt-4">
            <button
              type="button"
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              onClick={() => setShowPurchaseModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={purchaseNumber}
              disabled={!selectedCountry || !selectedService || purchasing}
            >
              {purchasing ? (
                <>
                  <FiRefreshCw className="inline-block mr-2 animate-spin" />
                  Purchasing...
                </>
              ) : (
                "Purchase Number"
              )}
            </button>
          </div>
        </div>
      </Modal>
      
      {/* SMS Messages Modal */}
      <Modal
        isOpen={showMessagesModal}
        onClose={() => setShowMessagesModal(false)}
        title={`SMS Messages for ${selectedNumber?.phone || ""}`}
        size="lg"
      >
        <div className="space-y-4">
          {loadingMessages ? (
            <div className="flex justify-center py-8">
              <FiRefreshCw className="animate-spin mr-2" />
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No messages received yet
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="p-4 border rounded-lg dark:border-gray-700">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      From: {message.sender}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(message.received_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200">{message.message}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => selectedNumber && fetchMessages(selectedNumber)}
              disabled={loadingMessages || !selectedNumber}
            >
              <FiRefreshCw className={`inline-block mr-2 ${loadingMessages ? "animate-spin" : ""}`} />
              Refresh Messages
            </button>
          </div>
        </div>
      </Modal>
      {/* CSS for toast notification */}
      <style jsx global>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .animate-fade-in-out {
          animation: fadeInOut 2s ease-in-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}