'use client'

import { useState, useEffect } from 'react'
import { currencies } from '../app/utils/currencies'

// Mock exchange rates - in a real application, you would fetch these from an API
const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.74,
  ZAR: 15.23,
  JPY: 109.95,
  CNY: 6.45,
  INR: 73.15,
  CAD: 1.25,
  AUD: 1.34,
  CHF: 0.92,
  NZD: 1.41,
  // Add exchange rates for other currencies relative to USD
}

// Initialize all other currencies with a default rate if not specified
currencies.forEach(currency => {
  if (!exchangeRates[currency.code]) {
    exchangeRates[currency.code] = 1.5; // Default fallback rate
  }
});

interface CurrencyConverterProps {
  baseCurrency: string;
}

export default function CurrencyConverter({ baseCurrency }: CurrencyConverterProps) {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>(baseCurrency);
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [convertedAmount, setConvertedAmount] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Update fromCurrency when baseCurrency changes
  useEffect(() => {
    setFromCurrency(baseCurrency);
  }, [baseCurrency]);

  // Convert the amount when any of the inputs change
  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        // Convert to USD first (as base), then to target currency
        const valueInUSD = numAmount / exchangeRates[fromCurrency];
        const convertedValue = valueInUSD * exchangeRates[toCurrency];
        setConvertedAmount(convertedValue.toFixed(2));
      }
    }
  }, [amount, fromCurrency, toCurrency]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mt-1 text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
      >
        Show Currency Converter
      </button>
    );
  }

  return (
    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
      <div className="flex justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">Currency Converter</h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="amount" className="block text-xs font-medium text-gray-500">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs"
          />
        </div>
        
        <div>
          <label htmlFor="fromCurrency" className="block text-xs font-medium text-gray-500">
            From
          </label>
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs"
          >
            {currencies.map(currency => (
              <option key={`from-${currency.code}`} value={currency.code}>
                {currency.code} - {currency.symbol}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="toCurrency" className="block text-xs font-medium text-gray-500">
            To
          </label>
          <select
            id="toCurrency"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs"
          >
            {currencies.map(currency => (
              <option key={`to-${currency.code}`} value={currency.code}>
                {currency.code} - {currency.symbol}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-500">
            Result
          </label>
          <div className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-1.5 text-xs font-medium">
            {convertedAmount} {toCurrency}
          </div>
        </div>
      </div>
    </div>
  );
} 