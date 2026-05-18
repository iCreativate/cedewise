export const formatLargeCurrency = (amount: number): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (amount >= 1000000000) {
    return formatter.format(amount / 1000000000) + 'B';
  } else if (amount >= 1000000) {
    return formatter.format(amount / 1000000) + 'M';
  } else if (amount >= 1000) {
    return formatter.format(amount / 1000) + 'K';
  }

  return formatter.format(amount);
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount)
}

/** Full amount with thousands separators (e.g. 1,670,000,000). */
export function formatAmountDisplay(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') return '';
  const num =
    typeof amount === 'number'
      ? amount
      : parseFloat(String(amount).replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(num)) return '';
  return num.toLocaleString('en-US');
}

export const parseCurrencyString = (value: string): number => {
  // Remove currency symbol, spaces, and commas
  const cleanValue = value.replace(/[R\s,]/g, '')
  return parseFloat(cleanValue)
}

// Constants for currency
export const CURRENCY = {
  code: 'ZAR',
  symbol: 'R',
  name: 'South African Rand'
} 