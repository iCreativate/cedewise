'use client'

import { useState, useEffect } from 'react'
import { ArrowPathIcon, CurrencyDollarIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

// Common currencies in reinsurance
const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
] as const

type CurrencyCode = typeof currencies[number]['code']

// Mock exchange rates for development
const mockRates: Record<CurrencyCode, Record<CurrencyCode, number>> = {
  USD: { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 151.62, CHF: 0.90, CAD: 1.35, AUD: 1.52, SGD: 1.35, HKD: 7.82, CNY: 7.23 },
  EUR: { USD: 1.09, EUR: 1, GBP: 0.86, JPY: 164.80, CHF: 0.98, CAD: 1.47, AUD: 1.65, SGD: 1.47, HKD: 8.50, CNY: 7.86 },
  GBP: { USD: 1.27, EUR: 1.16, GBP: 1, JPY: 191.92, CHF: 1.14, CAD: 1.71, AUD: 1.92, SGD: 1.71, HKD: 9.90, CNY: 9.15 },
  JPY: { USD: 0.0066, EUR: 0.0061, GBP: 0.0052, JPY: 1, CHF: 0.0059, CAD: 0.0089, AUD: 0.010, SGD: 0.0089, HKD: 0.052, CNY: 0.048 },
  CHF: { USD: 1.11, EUR: 1.02, GBP: 0.88, JPY: 168.47, CHF: 1, CAD: 1.50, AUD: 1.69, SGD: 1.50, HKD: 8.69, CNY: 8.03 },
  CAD: { USD: 0.74, EUR: 0.68, GBP: 0.58, JPY: 112.31, CHF: 0.67, CAD: 1, AUD: 1.13, SGD: 1.00, HKD: 5.79, CNY: 5.36 },
  AUD: { USD: 0.66, EUR: 0.61, GBP: 0.52, JPY: 99.75, CHF: 0.59, CAD: 0.89, AUD: 1, SGD: 0.89, HKD: 5.14, CNY: 4.76 },
  SGD: { USD: 0.74, EUR: 0.68, GBP: 0.58, JPY: 112.31, CHF: 0.67, CAD: 1.00, AUD: 1.13, SGD: 1, HKD: 5.79, CNY: 5.36 },
  HKD: { USD: 0.13, EUR: 0.12, GBP: 0.10, JPY: 19.39, CHF: 0.12, CAD: 0.17, AUD: 0.19, SGD: 0.17, HKD: 1, CNY: 0.92 },
  CNY: { USD: 0.14, EUR: 0.13, GBP: 0.11, JPY: 20.97, CHF: 0.12, CAD: 0.19, AUD: 0.21, SGD: 0.19, HKD: 1.08, CNY: 1 },
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('1')
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('USD')
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('EUR')
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Fetch exchange rate
  const fetchExchangeRate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Using mock rates for development
      const rate = mockRates[fromCurrency][toCurrency]
      setExchangeRate(rate)
      setLastUpdated(new Date())
    } catch (err) {
      setError('Failed to fetch exchange rate. Please try again later.')
      console.error('Error fetching exchange rate:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch and when currencies change
  useEffect(() => {
    fetchExchangeRate()
  }, [fromCurrency, toCurrency])

  // Calculate converted amount
  const convertedAmount = exchangeRate ? Number(amount) * exchangeRate : null

  // Format currency amount
  const formatAmount = (value: number | null, currency: string) => {
    if (value === null) return ''
    const currencyInfo = currencies.find(c => c.code === currency)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Currency Converter</h1>
          <p className="mt-1 text-sm text-gray-500">
            Convert between different currencies used in reinsurance
          </p>
        </div>
        <button
          onClick={fetchExchangeRate}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Rates
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Converter Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700">
                  From
                </label>
                <select
                  id="fromCurrency"
                  name="fromCurrency"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700">
                  To
                </label>
                <select
                  id="toCurrency"
                  name="toCurrency"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setFromCurrency(toCurrency)
                setToCurrency(fromCurrency)
              }}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowRightIcon className="h-4 w-4 mr-2 transform rotate-90" />
              Swap Currencies
            </button>
          </div>
        </div>

        {/* Result */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Converted Amount</h3>
              <div className="mt-2 text-3xl font-semibold text-gray-900">
                {formatAmount(convertedAmount, toCurrency)}
              </div>
              {exchangeRate && (
                <p className="mt-1 text-sm text-gray-500">
                  1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {lastUpdated && (
              <div className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleString()}
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-900">Common Use Cases</h4>
              <ul className="mt-2 text-sm text-gray-500 list-disc list-inside space-y-1">
                <li>Convert premium amounts between currencies</li>
                <li>Calculate loss amounts in different currencies</li>
                <li>Convert treaty limits and deductibles</li>
                <li>Compare reinsurance costs across currencies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 