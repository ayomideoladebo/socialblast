// 5Sim API service for fetching real phone numbers
// Documentation: https://5sim.net/docs/

import { FIVESIM_API_KEY, FIVESIM_BASE_URL } from './config';

// Types for 5Sim API responses
export type PhoneNumber = {
  id: string;
  phone: string;
  operator: string;
  product: string;
  price: number;
  status: string;
  expires: string;
  sms: SMS[];
  country: string;
};

export type SMS = {
  id: string;
  date: string;
  sender: string;
  text: string;
  code: string;
};

export type PriceItem = {
  count: number;
  price: number;
};

export type CountryPrices = {
  [country: string]: {
    [operator: string]: {
      [product: string]: PriceItem;
    };
  };
};

// Helper function to make API requests
const fetchFromAPI = async (endpoint: string, options = {}) => {
  const method = options.method || 'GET';
  const url = `/api/5sim?endpoint=${encodeURIComponent(endpoint)}`;
  
  let response;
  if (method === 'GET') {
    response = await fetch(url);
  } else {
    response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: options.body,
    });
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`5Sim API error: ${error}`);
  }

  return response.json();
};

// Get available countries, operators, and products with prices
export const getPrices = async (): Promise<CountryPrices> => {
  return fetchFromAPI("/guest/prices");
};

// Get available countries
export const getCountries = async (): Promise<string[]> => {
  const prices = await getPrices();
  return Object.keys(prices);
};

// Get available services (products) for a country
export const getServices = async (country: string): Promise<string[]> => {
  const prices = await getPrices();
  if (!prices[country]) return [];
  
  const services = new Set<string>();
  
  Object.values(prices[country]).forEach((operators) => {
    Object.keys(operators).forEach((product) => {
      services.add(product);
    });
  });
  
  return Array.from(services);
};

// Purchase a phone number
export const purchaseNumber = async (
  country: string,
  operator: string,
  product: string
): Promise<PhoneNumber> => {
  return fetchFromAPI(`/user/buy/activation/${country}/${operator}/${product}`);
};

// Get purchased phone numbers
export const getPurchasedNumbers = async (): Promise<PhoneNumber[]> => {
  const response = await fetchFromAPI("/user/activations");
  return response.activations || [];
};

// Get SMS messages for a specific activation
export const getSMSMessages = async (activationId: string): Promise<SMS[]> => {
  const activation = await fetchFromAPI(`/user/check/${activationId}`);
  return activation.sms || [];
};

// Cancel a purchased number
export const cancelPurchase = async (activationId: string): Promise<void> => {
  await fetchFromAPI(`/user/cancel/${activationId}`);
};

// Finish using a purchased number
export const finishPurchase = async (activationId: string): Promise<void> => {
  await fetchFromAPI(`/user/finish/${activationId}`);
};

// Get account balance
export const getBalance = async (): Promise<number> => {
  const response = await fetchFromAPI("/user/profile");
  return response.balance || 0;
};

// Get available phone numbers for a specific country, operator, and product
export const getAvailableNumbers = async (
  country: string,
  operator: string = "any",
  product: string
): Promise<{ count: number; price: number }> => {
  const prices = await getPrices();
  
  if (!prices[country]) {
    throw new Error(`Country ${country} not available`);
  }
  
  if (operator === "any") {
    // Find any operator with available numbers for this product
    for (const op in prices[country]) {
      if (prices[country][op][product]) {
        return prices[country][op][product];
      }
    }
    throw new Error(`No operators available for ${product} in ${country}`);
  }
  
  if (!prices[country][operator] || !prices[country][operator][product]) {
    throw new Error(`${product} not available for ${operator} in ${country}`);
  }
  
  return prices[country][operator][product];
};