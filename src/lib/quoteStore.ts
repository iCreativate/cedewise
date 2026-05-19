export type FacQuoteType = 'proportional' | 'non-proportional';

export interface SubmittedReinsurerQuote {
  id: string;
  submissionId: string;
  facType: FacQuoteType;
  status: 'submitted';
  submittedAt: string;
  reinsurerName: string;
  brokerName: string;
  brokerEmails: string[];
  reference: string;
  insured: string;
  cedingCompany: string;
  quote: {
    shareOffer: string;
    quotePremiumAmount: string;
    quotePremiumRate: string;
    layer?: string;
    excessOf?: string;
    commission: string;
    overrider: string;
    brokerage: string;
    totalDeductions: string;
    deductionsPreset: string;
    quoteConditions: string;
    isProposingNewValues: boolean;
    premiumAtShareDisplay: string;
    premiumRateDisplay: string;
    premium100Display: string;
    sumInsuredFormatted: string;
  };
  submissionSnapshot: Record<string, unknown>;
}

const STORAGE_KEY = 'cedewise:brokerQuotes';

const globalForQuotes = globalThis as typeof globalThis & {
  __cedewiseSubmittedQuotes?: SubmittedReinsurerQuote[];
};

function getMemoryStore(): SubmittedReinsurerQuote[] {
  if (!globalForQuotes.__cedewiseSubmittedQuotes) {
    globalForQuotes.__cedewiseSubmittedQuotes = [];
  }
  return globalForQuotes.__cedewiseSubmittedQuotes;
}

export function listSubmittedQuotes(filters?: {
  submissionId?: string;
  brokerEmail?: string;
  facType?: FacQuoteType;
}): SubmittedReinsurerQuote[] {
  let quotes = [...getMemoryStore()].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  if (filters?.submissionId) {
    quotes = quotes.filter((q) => q.submissionId === filters.submissionId);
  }
  if (filters?.facType) {
    quotes = quotes.filter((q) => q.facType === filters.facType);
  }
  if (filters?.brokerEmail) {
    const email = filters.brokerEmail.toLowerCase();
    quotes = quotes.filter(
      (q) =>
        q.brokerEmails.some((e) => e.toLowerCase() === email) ||
        q.brokerEmails.length === 0
    );
  }

  return quotes;
}

export function addSubmittedQuote(quote: SubmittedReinsurerQuote): SubmittedReinsurerQuote {
  const store = getMemoryStore();
  const existingIdx = store.findIndex(
    (q) => q.submissionId === quote.submissionId && q.facType === quote.facType
  );
  if (existingIdx >= 0) {
    store[existingIdx] = quote;
  } else {
    store.unshift(quote);
  }
  return quote;
}

/** Client-only: mirror quotes for broker UI when API store resets on server restart. */
export function syncQuotesToClientStorage(quotes: SubmittedReinsurerQuote[]): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = readQuotesFromClientStorage();
    const byKey = new Map<string, SubmittedReinsurerQuote>();
    for (const q of [...existing, ...quotes]) {
      byKey.set(`${q.submissionId}:${q.facType}`, q);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...byKey.values()]));
    window.dispatchEvent(new CustomEvent('cedewise:quote-submitted', { detail: quotes[0] }));
  } catch {
    // ignore storage errors
  }
}

export function readQuotesFromClientStorage(): SubmittedReinsurerQuote[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SubmittedReinsurerQuote[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function applyQuoteToBrokerSubmission<T extends Record<string, unknown>>(
  submission: T,
  quote: SubmittedReinsurerQuote
): T {
  const conditions = quote.quote.quoteConditions?.trim();
  const feedback = [
    `Quote from ${quote.reinsurerName}: ${quote.quote.shareOffer}% share`,
    quote.quote.premiumAtShareDisplay ? `Premium ${quote.quote.premiumAtShareDisplay}` : '',
    conditions ? `Notes: ${conditions}` : '',
  ]
    .filter(Boolean)
    .join('. ');

  return {
    ...submission,
    status: 'Quoted',
    reinsurerOfferPercentage: `${quote.quote.shareOffer}%`,
    premiumAmount:
      quote.quote.premiumAtShareDisplay ||
      (submission.premiumAmount as string | undefined),
    premiumRate:
      quote.quote.premiumRateDisplay || (submission.premiumRate as string | undefined),
    feedbackFromReinsurer: feedback,
  };
}

export function mergeQuotes(
  serverQuotes: SubmittedReinsurerQuote[],
  clientQuotes: SubmittedReinsurerQuote[]
): SubmittedReinsurerQuote[] {
  const byKey = new Map<string, SubmittedReinsurerQuote>();
  for (const q of [...clientQuotes, ...serverQuotes]) {
    byKey.set(`${q.submissionId}:${q.facType}`, q);
  }
  return [...byKey.values()].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}
