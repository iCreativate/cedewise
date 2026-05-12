'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Tab } from '@headlessui/react';
import { PaperAirplaneIcon, DocumentArrowDownIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { useParams } from 'next/navigation';
import Chat from '@/components/Chat';
import DocumentUpload from '@/components/DocumentUpload';

interface Message {
  id: number;
  text: string;
  timestamp: string;
  sender: 'user' | 'broker';
}

interface SubmissionFormProps {
  type: 'proportional' | 'non-proportional';
  data: {
    cedingCompany: string;
    insuredName: string;
    reference: string;
    underwriter: string;
    status: string;
    policyReference: string;
    broker: string;
    classOfBusiness: string;
    businessOccupation: string;
    riskCountry: string;
    quoteRequiredPercentage: number;
    physicalDamage: number;
    businessInterruption: number;
    sumInsured: number;
    remainingShare: number;
    premiumRate: number;
    premiumAmount: number;
    deductions: {
      total: number;
      breakdown?: {
        name: string;
        percentage: number;
      }[];
    };
    startDate: string;
    endDate: string;
    description: string;
  };
}

export default function ReinsurerSubmissionForm({ type, data }: SubmissionFormProps) {
  const params = useParams();
  const routeId = (params as any)?.id ? String((params as any).id) : null;
  const [selectedTab, setSelectedTab] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [isProposingNewValues, setIsProposingNewValues] = useState(false);
  const [showQuoteDetails, setShowQuoteDetails] = useState(false);
  const [brokerNonPropSubmission, setBrokerNonPropSubmission] = useState<any>(null);
  // Quote inputs (Non-Proportional)
  const [quotePremiumAmount, setQuotePremiumAmount] = useState<string>('');
  const [quotePremiumRate, setQuotePremiumRate] = useState<string>('');
  const [shareOffer, setShareOffer] = useState<string>('');
  const [layer, setLayer] = useState<string>('');
  const [excessOf, setExcessOf] = useState<string>('');
  const [lastEdited, setLastEdited] = useState<'premium' | 'rate' | null>(null);
  const [deductionsPreset, setDeductionsPreset] = useState<'option1' | 'option2'>('option1');
  const [commission, setCommission] = useState<string>('20');
  const [overrider, setOverrider] = useState<string>('2.5');
  const [brokerage, setBrokerage] = useState<string>('2.5');
  const [copiedKey, setCopiedKey] = useState<'premium' | 'rate' | 'premium100' | null>(null);
  const chatSubmissionId = String(
    brokerNonPropSubmission?.policyReferenceNumber ?? routeId ?? 'unknown'
  );
  const proportionalDocFolder = `reinsurer-facultative/proportional/${routeId ?? 'submission'}`;
  const nonProportionalDocFolder = `reinsurer-facultative/non-proportional/${routeId ?? 'submission'}/documents`;
  const nonProportionalQuoteSupportingFolder = `reinsurer-facultative/non-proportional/${routeId ?? 'submission'}/quote-supporting`;

  const handleProposeNewValues = () => {
    setIsProposingNewValues(true);
    setShowDetails(true);
  };

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const formatCurrencySpaces = (value: string) => {
    const digits = String(value).replace(/[^0-9]/g, '');
    if (!digits) return '';
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const formatMoneySpaces = (value: string, decimals: number = 2) => {
    const raw = String(value).replace(/[^0-9.]/g, '');
    if (!raw) return '';
    const [intPartRaw, fracRaw = ''] = raw.split('.');
    const intDigits = (intPartRaw || '').replace(/^0+(?=\d)/, '') || '0';
    const intSpaced = intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const frac = fracRaw.slice(0, decimals).padEnd(decimals, '0');
    return `${intSpaced}.${frac}`;
  };

  const formatMoneySpacesLoose = (value: string, maxDecimals: number = 6) => {
    const raw = String(value).replace(/[^0-9.]/g, '');
    if (!raw) return '';
    const [intPartRaw, fracRaw = ''] = raw.split('.');
    const intDigits = (intPartRaw || '').replace(/^0+(?=\d)/, '') || '0';
    const intSpaced = intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const frac = fracRaw.slice(0, maxDecimals);
    return frac.length ? `${intSpaced}.${frac}` : intSpaced;
  };

  const normalizeMoney = (value: string) => {
    const n = parseNumber(value);
    if (!n) return '';
    return formatMoneySpaces(n.toFixed(2), 2);
  };

  const normalizeMoneyMax = (value: string, maxDecimals: number = 6) => {
    const n = parseNumber(value);
    if (!n) return '';
    const fixed = n.toFixed(maxDecimals);
    const trimmed = fixed.replace(/\.?0+$/, '');
    return formatMoneySpacesLoose(trimmed, maxDecimals);
  };

  const applyBrokerValuesToQuote = () => {
    setIsProposingNewValues(false);
    setShowQuoteDetails(false);
    setLastEdited(null);

    setShareOffer(String(data?.quoteRequiredPercentage ?? ''));
    setQuotePremiumAmount(normalizeMoney(String(data?.premiumAmount ?? '')));
    setQuotePremiumRate(String(data?.premiumRate ?? ''));

    // keep Layer/Excess as-is if user typed; otherwise default from Main Submission
    if (!layer) setLayer(formatCurrencySpaces(String(brokerNonPropSubmission?.sumInsured ?? '')));
    if (!excessOf) setExcessOf(formatCurrencySpaces(String(brokerNonPropSubmission?.excessLayer ?? '')));

    // Deduction presets from screenshot
    setDeductionsPreset('option1');
  };

  const enableProposeNewValues = () => {
    setIsProposingNewValues(true);
    // Prefill once (if empty) so user can adjust quickly
    if (!shareOffer) setShareOffer(String(data?.quoteRequiredPercentage ?? ''));
    if (!quotePremiumAmount) setQuotePremiumAmount(normalizeMoney(String(data?.premiumAmount ?? '')));
    if (!quotePremiumRate) setQuotePremiumRate(String(data?.premiumRate ?? ''));
    if (!layer) setLayer(formatCurrencySpaces(String(brokerNonPropSubmission?.sumInsured ?? '')));
    if (!excessOf) setExcessOf(formatCurrencySpaces(String(brokerNonPropSubmission?.excessLayer ?? '')));
  };

  const copyText = async (key: 'premium' | 'rate' | 'premium100', text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 900);
    } catch {
      // best-effort; ignore if clipboard blocked
    }
  };

  const parseNumber = (value: string): number => {
    const s0 = String(value ?? '').trim();
    if (!s0) return 0;

    // Support comma decimals (e.g. "0,09") while also allowing thousand separators/spaces.
    // If the string contains a comma but no dot, treat comma as the decimal separator.
    const normalized = (s0.includes(',') && !s0.includes('.')) ? s0.replace(/,/g, '.') : s0;

    const cleaned = normalized.replace(/[^0-9.-]+/g, '');
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  // Pull broker submission from sessionStorage (set by broker non-prop FAC list "View submission")
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('selectedSubmission');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setBrokerNonPropSubmission(parsed);
    } catch {
      // ignore
    }
  }, []);

  // If sessionStorage is empty (refresh/direct navigation), fall back to fetching by route id
  useEffect(() => {
    if (brokerNonPropSubmission) return;
    if (!routeId) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/broker-submissions/non-proportional-fac/${encodeURIComponent(routeId)}`, {
          method: 'GET',
        });
        if (!res.ok) return;
        const json = await res.json();
        if (cancelled) return;
        if (json && typeof json === 'object') {
          setBrokerNonPropSubmission(json);
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [routeId, brokerNonPropSubmission]);

  // My Quote defaults: Layer = Sum Insured, In excess = Excess Layer (from Main Submission)
  useEffect(() => {
    if (!brokerNonPropSubmission) return;
    if (!layer && brokerNonPropSubmission.sumInsured) {
      setLayer(formatCurrencySpaces(String(brokerNonPropSubmission.sumInsured)));
    }
    if (!excessOf && brokerNonPropSubmission.excessLayer) {
      setExcessOf(formatCurrencySpaces(String(brokerNonPropSubmission.excessLayer)));
    }
    // only prefill when empty, so user can still edit freely
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brokerNonPropSubmission]);

  const layerAmount = useMemo(() => {
    // Prefer user-entered layer amount; fallback to sumInsured.
    const manual = parseNumber(layer);
    return manual || (data?.sumInsured ?? 0);
  }, [data?.sumInsured, layer]);

  const shareOfferPct = useMemo(() => {
    const pct = parseNumber(shareOffer);
    return pct > 0 ? pct : 0;
  }, [shareOffer]);

  const premiumNumber = useMemo(() => parseNumber(quotePremiumAmount), [quotePremiumAmount]);
  const rateNumber = useMemo(() => parseNumber(quotePremiumRate), [quotePremiumRate]);

  const calcPremiumFromRate = useMemo(() => {
    if (!layerAmount || !rateNumber) return 0;
    return (layerAmount * rateNumber) / 100;
  }, [layerAmount, rateNumber]);

  const premiumAtShareOffer = useMemo(() => {
    if (!premiumNumber || !shareOfferPct) return 0;
    return premiumNumber * (shareOfferPct / 100);
  }, [premiumNumber, shareOfferPct]);

  const premiumAtShareOfferFromRate = useMemo(() => {
    if (!calcPremiumFromRate || !shareOfferPct) return 0;
    return calcPremiumFromRate * (shareOfferPct / 100);
  }, [calcPremiumFromRate, shareOfferPct]);

  const calcRateFromPremium = useMemo(() => {
    if (!layerAmount || !premiumNumber) return 0;
    return (premiumNumber / layerAmount) * 100;
  }, [layerAmount, premiumNumber]);

  const calcPremiumRateAtShareOffer = useMemo(() => {
    // (Premium amount / Layer Amount) * 100 * Share offer
    if (!layerAmount || !premiumNumber || !shareOfferPct) return 0;
    return ((premiumNumber / layerAmount) * 100) * (shareOfferPct / 100);
  }, [layerAmount, premiumNumber, shareOfferPct]);

  const calcPremium100 = useMemo(() => {
    // (Premium amount / Layer Amount) * 100  (as displayed in screenshot)
    if (!layerAmount || !premiumNumber) return 0;
    return (premiumNumber / layerAmount) * 100;
  }, [layerAmount, premiumNumber]);

  const totalDeductions = useMemo(() => {
    return (parseNumber(commission) + parseNumber(overrider) + parseNumber(brokerage)).toFixed(2);
  }, [commission, overrider, brokerage]);

  useEffect(() => {
    if (deductionsPreset === 'option1') {
      setCommission('20');
      setOverrider('2.5');
      setBrokerage('2.5');
      return;
    }
    // Option 2: FOC (Free of Commission)
    setCommission('0');
    setOverrider('0');
    setBrokerage('0');
  }, [deductionsPreset]);

  // Auto-calc (Premium <-> Rate) for Non-Proportional quote
  useEffect(() => {
    if (!layerAmount) return;

    if (lastEdited === 'premium') {
      if (!quotePremiumRate && quotePremiumAmount) {
        const prem = parseNumber(quotePremiumAmount);
        if (!prem) return;
        const rate = (prem / layerAmount) * 100;
        setQuotePremiumRate(rate.toFixed(2));
      }
      return;
    }

    if (lastEdited === 'rate') {
      if (!quotePremiumAmount && quotePremiumRate) {
        const rate = parseNumber(quotePremiumRate);
        if (!rate) return;
        const prem = (layerAmount * rate) / 100;
        setQuotePremiumAmount(normalizeMoneyMax(prem.toString(), 6));
      }
    }
  }, [layerAmount, lastEdited, quotePremiumAmount, quotePremiumRate]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Top Level Navigation Tabs */}
      <Tab.Group>
        <Tab.List className="flex border-b border-gray-200 mb-[35px]">
          <Tab className={({ selected }) =>
            `px-6 py-3 text-sm font-medium border-b-2 ${
              selected
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`
          }>
            Proportional Fac
          </Tab>
          <Tab className={({ selected }) =>
            `px-6 py-3 text-sm font-medium border-b-2 ${
              selected
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`
          }>
            Non-Proportional Fac
          </Tab>
          <Tab className={({ selected }) =>
            `px-6 py-3 text-sm font-medium border-b-2 ${
              selected
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`
          }>
            My Quotes
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* Proportional Fac Panel */}
          <Tab.Panel>
            {/* Header Section */}
            <div className="bg-blue-600 rounded-xl p-6 text-white mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                Proportional Facultative Reinsurance
              </h2>
              <div className="grid grid-cols-5 gap-4 text-sm">
                <div>
                  <p className="text-blue-200">Submission from:</p>
                  <p className="font-medium">Ceding Company</p>
                </div>
                <div>
                  <p className="text-blue-200">Insured Name:</p>
                  <p className="font-medium">Vulcan</p>
                </div>
                <div>
                  <p className="text-blue-200">Reference:</p>
                  <p className="font-medium">NPR-456789-1234</p>
                </div>
                <div>
                  <p className="text-blue-200">Underwriter:</p>
                  <p className="font-medium">Insurer Demo</p>
                </div>
                <div>
                  <p className="text-blue-200">Status:</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending Review
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-6">
              {/* Left Content - Form */}
              <div className="col-span-2">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                    <Tab.List className="flex border-b border-gray-200">
                      <Tab className={({ selected }) =>
                        `px-6 py-3 text-sm font-medium border-b-2 ${
                          selected
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                        }`
                      }>
                        Submission Details
                      </Tab>
                      <Tab className={({ selected }) =>
                        `px-6 py-3 text-sm font-medium border-b-2 ${
                          selected
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                        }`
                      }>
                        My Quote
                      </Tab>
                      <Tab className={({ selected }) =>
                        `px-6 py-3 text-sm font-medium border-b-2 ${
                          selected
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                        }`
                      }>
                        My Documents
                      </Tab>
                      <Tab className={({ selected }) =>
                        `px-6 py-3 text-sm font-medium border-b-2 ${
                          selected
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                        }`
                      }>
                        Risk Address
                      </Tab>
                      <Tab className={({ selected }) =>
                        `px-6 py-3 text-sm font-medium border-b-2 ${
                          selected
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                        }`
                      }>
                        Currency Calculator
                      </Tab>
                    </Tab.List>

                    <Tab.Panels>
                      {/* Submission Details Panel */}
                      <Tab.Panel className="p-6">
                        <div className="bg-white rounded-lg">
                          <div className="flex justify-between items-center mb-8">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">Submission Information</h3>
                              <p className="mt-1 text-sm text-gray-500">Review and manage submission details</p>
                            </div>
                            <div className="flex space-x-3">
                              <button
                                type="button"
                                onClick={() => setSelectedTab(1)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Quote
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-8">
                            {/* Basic Information */}
                            <div className="bg-gray-50 rounded-lg p-6">
                              <h4 className="text-base font-medium text-gray-900 mb-4">Basic Information</h4>
                              <div className="grid grid-cols-3 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Ceding Company</label>
                                  <input
                                    type="text"
                                    defaultValue="Santam"
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Insured</label>
                                  <input
                                    type="text"
                                    defaultValue="Vulcan"
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Policy Reference Number</label>
                                  <input
                                    type="text"
                                    defaultValue="NPR-456789-1234"
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Broker</label>
                                  <input
                                    type="text"
                                    defaultValue="AON"
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Class of Business</label>
                                  <input
                                    type="text"
                                    defaultValue="Property"
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Occupation</label>
                                  <input
                                    type="text"
                                    defaultValue="Mining"
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Risk Details */}
                            <div className="bg-gray-50 rounded-lg p-6">
                              <h4 className="text-base font-medium text-gray-900 mb-4">Risk Details</h4>
                              <div className="grid grid-cols-3 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Risk Country</label>
                                  <input
                                    type="text"
                                    defaultValue="Mozambique"
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Quote Required (%)</label>
                                  <input
                                    type="text"
                                    defaultValue="75"
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Physical Damage</label>
                                  <input
                                    type="text"
                                    defaultValue="R 120,000,000"
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Interruption</label>
                                  <input
                                    type="text"
                                    defaultValue="R 47,000,000"
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Sum Insured</label>
                                  <input
                                    type="text"
                                    defaultValue="R 167,000,000"
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Premium Rate (%)</label>
                                  <input
                                    type="text"
                                    defaultValue="2.5"
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Premium Amount</label>
                                  <input
                                    type="text"
                                    defaultValue="R 4,175,000"
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                  <input
                                    type="text"
                                    defaultValue="01 Jan 2024"
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                  <input
                                    type="text"
                                    defaultValue="31 Dec 2024"
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                  defaultValue="Mining facility with state-of-the-art equipment and safety measures."
                                  disabled
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                                  rows={3}
                                />
                              </div>
                            </div>

                            {/* Financial Information */}
                            <div className="bg-gray-50 rounded-lg p-6">
                              <h4 className="text-base font-medium text-gray-900 mb-4">Financial Information</h4>
                              <div className="grid grid-cols-3 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Physical Damage</label>
                                  <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <span className="text-gray-500 sm:text-sm">R</span>
                                    </div>
                                    <input
                                      type="number"
                                      defaultValue="1200000000"
                                      className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Interruption</label>
                                  <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <span className="text-gray-500 sm:text-sm">R</span>
                                    </div>
                                    <input
                                      type="number"
                                      defaultValue="470000000"
                                      className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Sum Insured</label>
                                  <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <span className="text-gray-500 sm:text-sm">R</span>
                                    </div>
                                    <input
                                      type="number"
                                      defaultValue="1670000000"
                                      className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Remaining Share (%)</label>
                                  <input
                                    type="number"
                                    defaultValue="50"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Premium Rate (%)</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    defaultValue="2.5"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Premium Amount</label>
                                  <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <span className="text-gray-500 sm:text-sm">R</span>
                                    </div>
                                    <input
                                      type="number"
                                      defaultValue="41750000"
                                      className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Deductions & Dates */}
                            <div className="bg-gray-50 rounded-lg p-6">
                              <h4 className="text-base font-medium text-gray-900 mb-4">Deductions & Period</h4>
                              <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-3">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Deductions (%)</label>
                                  <div className="mt-1 space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="number"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="Total"
                                      />
                                      <span className="text-sm text-gray-500">Total</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                  <input
                                    type="date"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                  <input
                                    type="date"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Loss Ratio (%)</label>
                                  <input
                                    type="number"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <div className="bg-gray-50 rounded-lg p-6">
                              <h4 className="text-base font-medium text-gray-900 mb-4">Additional Information</h4>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                  rows={4}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab.Panel>

                      {/* My Quote Panel */}
                      <Tab.Panel className="p-6">
                        <div className="space-y-6">
                          <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Munich Re's Quote</h3>
                            <p className="text-sm text-gray-600 mb-6">Provide your proposal for this proportional facultative submission</p>

                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Share Offer (%)</label>
                                <div className="mt-1 relative">
                                  <input
                                    id="pro-quote-share-offer"
                                    name="shareOffer"
                                    autoComplete="off"
                                    type="number"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-8"
                                    placeholder="Enter share percentage"
                                    value={shareOffer}
                                    onChange={(e) => setShareOffer(e.target.value)}
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">%</span>
                                  </div>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Enter the percentage share you wish to offer</p>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">Sum Insured Amount</label>
                                <div className="mt-1 bg-gray-50 p-3 rounded-md border border-gray-200">
                                  {String(data?.sumInsured ?? '').toLocaleString()} {String((data as any)?.currency ?? '')}
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">Premium</label>
                                <div className="mt-1 relative">
                                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">R</span>
                                  </div>
                                  <input
                                    id="pro-quote-premium"
                                    name="premiumAmount"
                                    autoComplete="off"
                                    type="text"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-8"
                                    placeholder="Enter premium amount"
                                    value={quotePremiumAmount}
                                    onChange={(e) => {
                                      setLastEdited('premium');
                                      setQuotePremiumAmount(formatMoneySpacesLoose(e.target.value, 6));
                                      if (quotePremiumRate) setQuotePremiumRate('');
                                    }}
                                    onBlur={() => {
                                      if (!quotePremiumAmount) return;
                                      setQuotePremiumAmount(normalizeMoneyMax(quotePremiumAmount, 6));
                                    }}
                                  />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">If Premium is entered and Rate is empty, Rate is auto-calculated.</p>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">Rate</label>
                                <div className="mt-1 relative">
                                  <input
                                    id="pro-quote-rate"
                                    name="premiumRate"
                                    inputMode="decimal"
                                    autoComplete="off"
                                    type="text"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-8"
                                    placeholder="Enter premium rate"
                                    value={quotePremiumRate}
                                    onChange={(e) => {
                                      setLastEdited('rate');
                                      setQuotePremiumRate(e.target.value);
                                      if (quotePremiumAmount) setQuotePremiumAmount('');
                                    }}
                                    onBlur={() => {
                                      if (!quotePremiumRate) return;
                                      const n = parseNumber(quotePremiumRate);
                                      if (!n) return;
                                      setQuotePremiumRate(n.toFixed(2));
                                    }}
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">%</span>
                                  </div>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">If Rate is entered and Premium is empty, Premium is auto-calculated.</p>
                              </div>

                              <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Total Deductions</label>
                                <select
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white p-3"
                                  value={deductionsPreset}
                                  onChange={(e) => setDeductionsPreset(e.target.value as 'option1' | 'option2')}
                                >
                                  <option value="option1">Commission 20%, Overrider 2.5%, Brokerage 2.5% (Total 25%)</option>
                                  <option value="option2">FOC (Free of Commission)</option>
                                </select>
                                <div className="mt-2 text-xs text-gray-600">
                                  Commission: {commission}% • Overrider: {overrider}% • Brokerage: {brokerage}% • <span className="font-medium">Total: {totalDeductions}%</span>
                                </div>
                              </div>
                            </div>

                            {/* Formula/value boxes (same as Non-Proportional, without Layer/In excess inputs) */}
                            <div className="mt-6 space-y-3">
                              <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                                <div className="text-sm font-semibold text-green-600">Premium</div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyText(
                                      'premium',
                                      premiumNumber && !rateNumber
                                        ? `R ${
                                            shareOfferPct
                                              ? formatMoneySpaces(premiumAtShareOffer.toFixed(2), 2)
                                              : normalizeMoney(quotePremiumAmount)
                                          }`
                                        : rateNumber
                                          ? `R ${
                                              shareOfferPct
                                                ? formatMoneySpaces(premiumAtShareOfferFromRate.toFixed(2), 2)
                                                : formatMoneySpaces(calcPremiumFromRate.toFixed(2), 2)
                                            }`
                                          : ''
                                    )
                                  }
                                  className="cursor-pointer select-text text-left bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-sm text-green-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.99] transition"
                                >
                                  {premiumNumber && !rateNumber ? (
                                    <>
                                      R{' '}
                                      {shareOfferPct
                                        ? formatMoneySpaces(premiumAtShareOffer.toFixed(2), 2)
                                        : normalizeMoney(quotePremiumAmount)}
                                    </>
                                  ) : rateNumber ? (
                                    <>
                                      R{' '}
                                      {shareOfferPct
                                        ? formatMoneySpaces(premiumAtShareOfferFromRate.toFixed(2), 2)
                                        : formatMoneySpaces(calcPremiumFromRate.toFixed(2), 2)}
                                    </>
                                  ) : (
                                    <>—</>
                                  )}
                                  <span className="ml-2 text-[11px] text-gray-500">
                                    {copiedKey === 'premium' ? 'Copied' : 'Click to copy'}
                                  </span>
                                </button>
                              </div>

                              <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                                <div className="text-sm font-semibold text-green-600">Premium Rate</div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyText(
                                      'rate',
                                      quotePremiumRate
                                        ? `${parseNumber(quotePremiumRate).toFixed(2)}%`
                                        : (layerAmount && premiumNumber)
                                          ? `${calcRateFromPremium.toFixed(2)}%`
                                          : ''
                                    )
                                  }
                                  className="cursor-pointer select-text text-left bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-sm text-green-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.99] transition"
                                >
                                  {quotePremiumRate ? (
                                    <>{parseNumber(quotePremiumRate).toFixed(2)}%</>
                                  ) : layerAmount && premiumNumber ? (
                                    <>{calcRateFromPremium.toFixed(2)}%</>
                                  ) : (
                                    <>—</>
                                  )}
                                  <span className="ml-2 text-[11px] text-gray-500">
                                    {copiedKey === 'rate' ? 'Copied' : 'Click to copy'}
                                  </span>
                                </button>
                              </div>

                              <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                                <div className="text-sm font-semibold text-green-600">100% Premium</div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyText(
                                      'premium100',
                                      premiumNumber
                                        ? `R ${formatMoneySpacesLoose(quotePremiumAmount, 6)}`
                                        : rateNumber
                                          ? `R ${formatMoneySpacesLoose(calcPremiumFromRate.toString(), 6)}`
                                          : ''
                                    )
                                  }
                                  className="cursor-pointer select-text text-left bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-sm text-green-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.99] transition"
                                >
                                  {premiumNumber ? (
                                    <>R {formatMoneySpacesLoose(quotePremiumAmount, 6)}</>
                                  ) : rateNumber ? (
                                    <>R {formatMoneySpacesLoose(calcPremiumFromRate.toString(), 6)}</>
                                  ) : (
                                    <>—</>
                                  )}
                                  <span className="ml-2 text-[11px] text-gray-500">
                                    {copiedKey === 'premium100' ? 'Copied' : 'Click to copy'}
                                  </span>
                                </button>
                              </div>
                            </div>

                            <div className="mt-8 flex items-center space-x-4">
                              <button
                                type="button"
                                onClick={applyBrokerValuesToQuote}
                                className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${
                                  !isProposingNewValues 
                                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                                    : 'text-gray-700 bg-white hover:bg-gray-50'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                              >
                                Accept Broker Values
                              </button>
                              <button
                                type="button"
                                onClick={enableProposeNewValues}
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                                  isProposingNewValues
                                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                                    : 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                              >
                                Propose New Values
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowQuoteDetails((v) => !v)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                              >
                                Show Details
                                <svg 
                                  className={`ml-1 h-5 w-5 transform transition-transform ${showQuoteDetails ? 'rotate-180' : ''}`} 
                                  viewBox="0 0 20 20" 
                                  fill="currentColor"
                                >
                                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </Tab.Panel>

                      {/* My Documents Panel */}
                      <Tab.Panel className="p-6">
                        <div className="bg-white rounded-lg">
                          <div className="flex justify-between items-center mb-8">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">Documents</h3>
                              <p className="mt-1 text-sm text-gray-500">Manage and view submission documents</p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                document.getElementById('reinsurer-fac-document-input-prop')?.click()
                              }
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Upload Document
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-8">
                            {/* Document List */}
                            <div className="bg-gray-50 rounded-lg p-6">
                              <h4 className="text-base font-medium text-gray-900 mb-4">Uploaded Documents</h4>
                              <div className="space-y-4">
                                {[
                                  'Risk Assessment Report.pdf',
                                  'Property Valuation.pdf',
                                  'Safety Measures Documentation.pdf'
                                ].map((doc, index) => (
                                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                    <div className="flex items-center">
                                      <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                      </svg>
                                      <span className="text-sm font-medium text-gray-900">{doc}</span>
                                    </div>
                                    <div className="flex space-x-3">
                                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        Download
                                      </button>
                                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Upload Section */}
                            <div className="bg-gray-50 rounded-lg p-6">
                              <h4 className="text-base font-medium text-gray-900 mb-4">Upload New Document</h4>
                              <DocumentUpload
                                fileInputId="reinsurer-fac-document-input-prop"
                                bucketName="cedewise-documents"
                                folderPath={proportionalDocFolder}
                                multiple
                              />
                              <p className="mt-2 text-xs text-gray-500">
                                PDF, Word, Excel, images up to 10MB each
                              </p>
                            </div>
                          </div>
                        </div>
                      </Tab.Panel>

                      {/* Risk Address Panel */}
                      <Tab.Panel className="p-6">
                        <div className="bg-white rounded-lg">
                          <div className="flex justify-between items-center mb-8">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">Risk Location Details</h3>
                              <p className="mt-1 text-sm text-gray-500">View and manage risk location information</p>
                            </div>
                            <div className="flex space-x-3">
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Edit
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-8">
                            {/* Address Information */}
                            <div className="bg-gray-50 rounded-lg p-6">
                              <h4 className="text-base font-medium text-gray-900 mb-4">Address Details</h4>
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                  <input
                                    type="text"
                                    defaultValue="123 Mining Road"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                  <input
                                    type="text"
                                    defaultValue="Tete"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Province/State</label>
                                  <input
                                    type="text"
                                    defaultValue="Tete Province"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                  <select
                                    defaultValue="Mozambique"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  >
                                    <option>Mozambique</option>
                                    <option>South Africa</option>
                                    <option>Namibia</option>
                                    <option>Botswana</option>
                                    <option>Zimbabwe</option>
                                    <option>Zambia</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* GPS Coordinates */}
                            <div className="bg-gray-50 rounded-lg p-6">
                              <h4 className="text-base font-medium text-gray-900 mb-4">GPS Coordinates</h4>
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                  <input
                                    type="text"
                                    defaultValue="-16.1549"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                  <input
                                    type="text"
                                    defaultValue="33.5868"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab.Panel>

                      {/* Currency Calculator Panel */}
                      <Tab.Panel className="p-6">
                        <div className="bg-white rounded-lg">
                          <div className="flex justify-between items-center mb-8">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">Currency Converter & Calculator</h3>
                              <p className="mt-1 text-sm text-gray-500">Convert currencies and calculate premiums</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-8">
                            {/* Currency Converter */}
                            <div className="bg-gray-50 rounded-lg p-6">
                              <h4 className="text-base font-medium text-gray-900 mb-4">Currency Converter</h4>
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                  <input
                                    type="number"
                                    placeholder="Enter amount"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">From Currency</label>
                                  <select
                                    defaultValue="USD"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  >
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="ZAR">ZAR - South African Rand</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">To Currency</label>
                                  <select
                                    defaultValue="EUR"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  >
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="ZAR">ZAR - South African Rand</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Converted Amount</label>
                                  <div className="mt-1 bg-gray-100 p-3 rounded-md border border-gray-200">
                                    0.00 EUR
                                  </div>
                                </div>
                              </div>
                              <div className="mt-6">
                                <button
                                  type="button"
                                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Convert Currency
                                </button>
                              </div>
                            </div>

                            {/* Premium Calculator */}
                            <div className="bg-gray-50 rounded-lg p-6">
                              <h4 className="text-base font-medium text-gray-900 mb-4">Premium Calculator</h4>
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Sum Insured</label>
                                  <div className="mt-1 bg-gray-100 p-3 rounded-md border border-gray-200">
                                    R 1,670,000,000 USD
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Premium Rate (%)</label>
                                  <div className="mt-1 bg-gray-100 p-3 rounded-md border border-gray-200">
                                    2.5%
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Calculated Premium</label>
                                  <div className="mt-1 bg-gray-100 p-3 rounded-md border border-gray-200">
                                    R 41,750,000
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                  <div className="mt-1 bg-gray-100 p-3 rounded-md border border-gray-200">
                                    USD
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </div>

              {/* Right Content - Chat */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex flex-col h-[calc(100vh-8rem)]">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Communication with Broker</h3>
                  </div>
                  <div className="p-4">
                    <Chat
                      submissionId={chatSubmissionId}
                      className="h-[calc(100vh-14rem)]"
                      participantLabels={{ broker: 'Broker', reinsurer: 'Reinsurer', insurer: 'Insurer' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* Non-Proportional Fac Panel */}
          <Tab.Panel>
            {/* Header Section */}
            <div className="bg-blue-600 rounded-xl p-6 text-white mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                Non-Proportional Facultative Reinsurance
              </h2>
              <div className="grid grid-cols-5 gap-4 text-sm">
                <div>
                  <p className="text-blue-200">Submission from:</p>
                  <p className="font-medium">Ceding Company</p>
                </div>
                <div>
                  <p className="text-blue-200">Insured Name:</p>
                  <p className="font-medium">Vulcan</p>
                </div>
                <div>
                  <p className="text-blue-200">Reference:</p>
                  <p className="font-medium">NPR-NPR-456789-1234</p>
                </div>
                <div>
                  <p className="text-blue-200">Underwriter:</p>
                  <p className="font-medium">Insurer Demo</p>
                </div>
                <div>
                  <p className="text-blue-200">Status:</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending Review
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-6">
              {/* Left Content - Form */}
              <div className="col-span-2">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                    <Tab.List className="flex border-b border-gray-200">
                      <Tab className={({ selected }) =>
                        `px-6 py-3 text-sm font-medium border-b-2 ${
                          selected
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                        }`
                      }>
                        Submission Details
                      </Tab>
                      <Tab className={({ selected }) =>
                        `px-6 py-3 text-sm font-medium border-b-2 ${
                          selected
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                        }`
                      }>
                        My Quote
                      </Tab>
                      <Tab className={({ selected }) =>
                        `px-6 py-3 text-sm font-medium border-b-2 ${
                          selected
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                        }`
                      }>
                        My Documents
                      </Tab>
                      <Tab className={({ selected }) =>
                        `px-6 py-3 text-sm font-medium border-b-2 ${
                          selected
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                        }`
                      }>
                        Risk Address
                      </Tab>
                      <Tab className={({ selected }) =>
                        `px-6 py-3 text-sm font-medium border-b-2 ${
                          selected
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                        }`
                      }>
                        Currency Calculator
                      </Tab>
                    </Tab.List>

                    <Tab.Panels>
                      {/* Main Submission Panel (pulled from broker Non-Proportional FAC form) */}
                      <Tab.Panel className="p-6">
                        <div className="bg-white rounded-lg">
                          <div className="flex justify-between items-center mb-6">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">Main Submission</h3>
                              <p className="mt-1 text-sm text-gray-500">Pulled from broker Non-Proportional Facultative Reinsurance form</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setSelectedTab(1)}
                                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              >
                                Quote
                              </button>
                            </div>
                          </div>

                          {!brokerNonPropSubmission ? (
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
                              No broker submission found. Open this from the broker Non-Proportional FAC page (it stores the selected submission in session storage).
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-6">
                              <div className="bg-gray-50 rounded-lg p-6">
                                <h4 className="text-base font-medium text-gray-900 mb-4">Submission Details</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Policy Reference Number</label>
                                    <input
                                      value={brokerNonPropSubmission.policyReferenceNumber ?? brokerNonPropSubmission.policyNo ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reinsurer Rating</label>
                                    <input
                                      value={brokerNonPropSubmission.reinsurer_rating ?? brokerNonPropSubmission.reinsurerRating ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Choose Reinsurer(s)</label>
                                    <input
                                      value={
                                        Array.isArray(brokerNonPropSubmission.selectedReinsurers)
                                          ? brokerNonPropSubmission.selectedReinsurers
                                              .map((r: any) => r?.name ?? r?.label ?? r?.company ?? r)
                                              .filter(Boolean)
                                              .join(', ')
                                          : brokerNonPropSubmission.reinsurers ??
                                            brokerNonPropSubmission.reinsurer ??
                                            brokerNonPropSubmission.reinsurerName ??
                                            ''
                                      }
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <input
                                      value={brokerNonPropSubmission.country ?? brokerNonPropSubmission.riskCountry ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                    <input
                                      value={brokerNonPropSubmission.currency ?? 'USD'}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Broker Company Name</label>
                                    <input
                                      value={brokerNonPropSubmission.company ?? brokerNonPropSubmission.cedingCompany ?? brokerNonPropSubmission.brokerCompany ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Company</label>
                                    <input
                                      value={brokerNonPropSubmission.insurance_company ?? brokerNonPropSubmission.insuranceCompany ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Insured Name</label>
                                    <input
                                      value={brokerNonPropSubmission.insured ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Broker</label>
                                    <input
                                      value={brokerNonPropSubmission.brokerName ?? brokerNonPropSubmission.broker ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Class of Business</label>
                                    <input
                                      value={brokerNonPropSubmission.classOfBusiness ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Occupation</label>
                                    <input
                                      value={brokerNonPropSubmission.businessOccupation ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Risk Country</label>
                                    <input
                                      value={brokerNonPropSubmission.riskCountry ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quote Required Percentage</label>
                                    <input
                                      value={brokerNonPropSubmission.quoteRequiredPercentage ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reinsurer Offer Percentage</label>
                                    <input
                                      value={brokerNonPropSubmission.reinsurerOfferPercentage ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Remaining Share (%)</label>
                                    <input
                                      value={brokerNonPropSubmission.remainingShare ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reinsurance Layer</label>
                                    <input
                                      value={brokerNonPropSubmission.reinsuranceLayer ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">In excess of</label>
                                    <input
                                      value={brokerNonPropSubmission.primaryLayer ?? brokerNonPropSubmission.excessLayer ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Layer</label>
                                    <input
                                      value={brokerNonPropSubmission.primaryLayer ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Physical Damage</label>
                                    <input
                                      value={brokerNonPropSubmission.physicalDamage ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Interruption - Loss of Profits</label>
                                    <input
                                      value={brokerNonPropSubmission.businessInterruption ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sum Insured (Total)</label>
                                    <input
                                      value={brokerNonPropSubmission.sumInsured ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Premium Rate (%)</label>
                                    <input
                                      value={brokerNonPropSubmission.premiumRate ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Premium Amount</label>
                                    <input
                                      value={brokerNonPropSubmission.premiumAmount ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Premium Amount at Reinsurer</label>
                                    <input
                                      value={
                                        brokerNonPropSubmission.premiumAmountAtReinsurer ??
                                        brokerNonPropSubmission.premiumAmountReinsurer ??
                                        brokerNonPropSubmission.reinsurerPremiumAmount ??
                                        ''
                                      }
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deductions (%)</label>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                      <input
                                        value={brokerNonPropSubmission.commission ?? ''}
                                        readOnly
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                        aria-label="Commission"
                                      />
                                      <input
                                        value={brokerNonPropSubmission.brokerage ?? ''}
                                        readOnly
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                        aria-label="Brokerage"
                                      />
                                      <input
                                        value={brokerNonPropSubmission.overriderCommission ?? ''}
                                        readOnly
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                        aria-label="Overrider commission"
                                      />
                                      <input
                                        value={brokerNonPropSubmission.totalDeductions ?? ''}
                                        readOnly
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                        aria-label="Total deductions"
                                      />
                                    </div>
                                    <div className="mt-2 text-xs text-gray-600">
                                      Commission • Brokerage • Overrider • <span className="font-medium">Total Deduction</span>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                      value={brokerNonPropSubmission.startDate ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input
                                      value={brokerNonPropSubmission.endDate ?? ''}
                                      readOnly
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="bg-gray-50 rounded-lg p-6">
                                <h4 className="text-base font-medium text-gray-900 mb-4">Description</h4>
                                <textarea value={brokerNonPropSubmission.description ?? ''} readOnly rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm" />
                              </div>

                              <div className="bg-gray-50 rounded-lg p-6">
                                <h4 className="text-base font-medium text-gray-900 mb-4">Documents</h4>
                                <div className="space-y-3">
                                  {[
                                    { key: 'lossHistory', label: 'Loss History' },
                                    { key: 'surveyReport', label: 'Survey Report' },
                                    { key: 'rationalFireDesign', label: 'Rational Fire Design' },
                                    { key: 'complianceLetter', label: 'Compliance Letter' },
                                    { key: 'sumInsuredCalculations', label: 'Sum Insured Calculations' },
                                  ].map((d) => {
                                    const fromBoolean =
                                      brokerNonPropSubmission.documentTypes?.[d.key] === true ||
                                      brokerNonPropSubmission.requiredDocuments?.[d.key] === true
                                    const fromList = Array.isArray(brokerNonPropSubmission.documents)
                                      ? brokerNonPropSubmission.documents.some((x: any) =>
                                          String(x ?? '')
                                            .toLowerCase()
                                            .includes(d.label.toLowerCase())
                                        )
                                      : false
                                    const checked = Boolean(fromBoolean || fromList)

                                    return (
                                      <label key={d.key} className="flex items-center gap-2 text-sm text-gray-700">
                                        <input type="checkbox" checked={checked} readOnly className="h-4 w-4" />
                                        <span>{d.label}</span>
                                      </label>
                                    )
                                  })}
                                </div>

                                <div className="mt-6">
                                  <div className="text-sm font-medium text-gray-900 mb-2">Uploaded Supporting Documents</div>
                                  {Array.isArray(brokerNonPropSubmission.uploadedFiles) && brokerNonPropSubmission.uploadedFiles.length > 0 ? (
                                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                      {brokerNonPropSubmission.uploadedFiles.map((f: any, idx: number) => (
                                        <li key={idx}>{f?.name ?? f?.filename ?? String(f)}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <div className="text-sm text-gray-600">No supporting documents uploaded.</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </Tab.Panel>

                      {/* My Quote Panel */}
                      <Tab.Panel className="p-6">
                        <div className="space-y-6">
                          <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Munich Re's Quote</h3>
                            <p className="text-sm text-gray-600 mb-6">Provide your proposal for this non-proportional reinsurance submission</p>
                            
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Share Offer (%)</label>
                                <div className="mt-1 relative">
                                  <input
                                    type="number"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-8"
                                    placeholder="Enter share percentage"
                                    value={shareOffer}
                                    onChange={(e) => setShareOffer(e.target.value)}
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">%</span>
                                  </div>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Enter the percentage share you wish to offer</p>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Sum Insured Amount</label>
                                <div className="mt-1 bg-gray-50 p-3 rounded-md border border-gray-200">
                                  R 1,670,000,000 USD
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">Premium</label>
                                <div className="mt-1 relative">
                                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">R</span>
                                  </div>
                                  <input
                                    type="text"
                                    id="np-quote-premium"
                                    name="premiumAmount"
                                    autoComplete="off"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-8"
                                    placeholder="Enter premium amount"
                                    value={quotePremiumAmount}
                                    onChange={(e) => {
                                      setLastEdited('premium');
                                      setQuotePremiumAmount(formatMoneySpacesLoose(e.target.value, 6));
                                      if (quotePremiumRate) setQuotePremiumRate('');
                                    }}
                                    onBlur={() => {
                                      if (!quotePremiumAmount) return;
                                      setQuotePremiumAmount(normalizeMoneyMax(quotePremiumAmount, 6));
                                    }}
                                  />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">If Premium is entered and Rate is empty, Rate is auto-calculated.</p>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">Rate</label>
                                <div className="mt-1 relative">
                                  <input
                                    type="text"
                                    id="np-quote-rate"
                                    name="premiumRate"
                                    inputMode="decimal"
                                    autoComplete="off"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-8"
                                    placeholder="Enter premium rate"
                                    value={quotePremiumRate}
                                    onChange={(e) => {
                                      setLastEdited('rate');
                                      setQuotePremiumRate(e.target.value);
                                      if (quotePremiumAmount) setQuotePremiumAmount('');
                                    }}
                                    onBlur={() => {
                                      if (!quotePremiumRate) return;
                                      const n = parseNumber(quotePremiumRate);
                                      if (!n) return;
                                      setQuotePremiumRate(n.toFixed(2));
                                    }}
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">%</span>
                                  </div>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">If Rate is entered and Premium is empty, Premium is auto-calculated.</p>
                              </div>
                              
                              <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Total Deductions</label>
                                <select
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white p-3"
                                  value={deductionsPreset}
                                  onChange={(e) => setDeductionsPreset(e.target.value as 'option1' | 'option2')}
                                >
                                  <option value="option1">Commission 20%, Overrider 2.5%, Brokerage 2.5% (Total 25%)</option>
                                  <option value="option2">FOC (Free of Commission)</option>
                                </select>
                                <div className="mt-2 text-xs text-gray-600">
                                  Commission: {commission}% • Overrider: {overrider}% • Brokerage: {brokerage}% • <span className="font-medium">Total: {totalDeductions}%</span>
                                </div>
                              </div>
                            </div>

                            {/* Layer + formula helpers (as per screenshot) */}
                            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                                <div className="flex flex-col gap-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr] items-center gap-3">
                                    <span className="text-sm font-semibold text-gray-700">Layer</span>
                                    <div className="relative">
                                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">R</span>
                                      </div>
                                      <input
                                        type="text"
                                        id="np-quote-layer"
                                        name="layer"
                                        inputMode="numeric"
                                        autoComplete="off"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-8 py-2.5"
                                        placeholder="e.g. 1 370 000 000"
                                        value={layer}
                                        onChange={(e) => setLayer(formatCurrencySpaces(e.target.value))}
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr] items-center gap-3">
                                    <span className="text-sm font-semibold text-gray-700">In excess</span>
                                    <div className="relative">
                                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">R</span>
                                      </div>
                                      <input
                                        type="text"
                                        id="np-quote-excess"
                                        name="excessOf"
                                        inputMode="numeric"
                                        autoComplete="off"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-8 py-2.5"
                                        placeholder="e.g. 300 000 000"
                                        value={excessOf}
                                        onChange={(e) => setExcessOf(formatCurrencySpaces(e.target.value))}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <p className="mt-4 text-xs text-gray-500">
                                  Layer defaults to Sum Insured if left blank.
                                </p>
                              </div>

                              <div className="space-y-3">
                                <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                                  <div className="text-sm font-semibold text-green-600">Premium</div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyText(
                                        'premium',
                                        premiumNumber && !rateNumber
                                          ? `R ${
                                              shareOfferPct
                                                ? formatMoneySpaces(premiumAtShareOffer.toFixed(2), 2)
                                                : normalizeMoney(quotePremiumAmount)
                                            }`
                                          : rateNumber
                                            ? `R ${
                                                shareOfferPct
                                                  ? formatMoneySpaces(premiumAtShareOfferFromRate.toFixed(2), 2)
                                                  : formatMoneySpaces(calcPremiumFromRate.toFixed(2), 2)
                                              }`
                                            : ''
                                      )
                                    }
                                    className="cursor-pointer select-text text-left bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-sm text-green-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.99] transition"
                                  >
                                    {premiumNumber && !rateNumber ? (
                                      <>
                                        R{' '}
                                        {shareOfferPct
                                          ? formatMoneySpaces(premiumAtShareOffer.toFixed(2), 2)
                                          : normalizeMoney(quotePremiumAmount)}
                                      </>
                                    ) : rateNumber ? (
                                      <>
                                        R{' '}
                                        {shareOfferPct
                                          ? formatMoneySpaces(premiumAtShareOfferFromRate.toFixed(2), 2)
                                          : formatMoneySpaces(calcPremiumFromRate.toFixed(2), 2)}
                                      </>
                                    ) : (
                                      <>—</>
                                    )}
                                    <span className="ml-2 text-[11px] text-gray-500">
                                      {copiedKey === 'premium' ? 'Copied' : 'Click to copy'}
                                    </span>
                                  </button>
                                </div>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                                  <div className="text-sm font-semibold text-green-600">Premium Rate</div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyText(
                                        'rate',
                                        quotePremiumRate
                                          ? `${parseNumber(quotePremiumRate).toFixed(2)}%`
                                          : (layerAmount && premiumNumber)
                                            ? `${calcRateFromPremium.toFixed(2)}%`
                                            : ''
                                      )
                                    }
                                    className="cursor-pointer select-text text-left bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-sm text-green-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.99] transition"
                                  >
                                    {quotePremiumRate ? (
                                      <>{parseNumber(quotePremiumRate).toFixed(2)}%</>
                                    ) : layerAmount && premiumNumber ? (
                                      <>{calcRateFromPremium.toFixed(2)}%</>
                                    ) : (
                                      <>—</>
                                    )}
                                    <span className="ml-2 text-[11px] text-gray-500">
                                      {copiedKey === 'rate' ? 'Copied' : 'Click to copy'}
                                    </span>
                                  </button>
                                </div>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                                  <div className="text-sm font-semibold text-green-600">100% Premium</div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyText(
                                        'premium100',
                                        premiumNumber
                                          ? `R ${formatMoneySpacesLoose(quotePremiumAmount, 6)}`
                                          : rateNumber
                                            ? `R ${formatMoneySpacesLoose(calcPremiumFromRate.toString(), 6)}`
                                            : ''
                                      )
                                    }
                                    className="cursor-pointer select-text text-left bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-sm text-green-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.99] transition"
                                  >
                                    {premiumNumber ? (
                                      <>R {formatMoneySpacesLoose(quotePremiumAmount, 6)}</>
                                    ) : rateNumber ? (
                                      <>R {formatMoneySpacesLoose(calcPremiumFromRate.toString(), 6)}</>
                                    ) : (
                                      <>—</>
                                    )}
                                    <span className="ml-2 text-[11px] text-gray-500">
                                      {copiedKey === 'premium100' ? 'Copied' : 'Click to copy'}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="mt-8 flex items-center space-x-4">
                              <button
                                type="button"
                                onClick={applyBrokerValuesToQuote}
                                className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${
                                  !isProposingNewValues 
                                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                                    : 'text-gray-700 bg-white hover:bg-gray-50'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                              >
                                Accept Broker Values
                              </button>
                              <button
                                type="button"
                                onClick={enableProposeNewValues}
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                                  isProposingNewValues
                                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                                    : 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                              >
                                Propose New Values
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowQuoteDetails((v) => !v)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                              >
                                Show Details
                                <svg 
                                  className={`ml-1 h-5 w-5 transform transition-transform ${showQuoteDetails ? 'rotate-180' : ''}`} 
                                  viewBox="0 0 20 20" 
                                  fill="currentColor"
                                >
                                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>

                            {showQuoteDetails && (
                              <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-4">Deductions breakdown</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">Commission (%)</label>
                                    <input
                                      type="text"
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                      value={commission}
                                      onChange={(e) => setCommission(e.target.value)}
                                      disabled={!isProposingNewValues}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">Overrider (%)</label>
                                    <input
                                      type="text"
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                      value={overrider}
                                      onChange={(e) => setOverrider(e.target.value)}
                                      disabled={!isProposingNewValues}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">Brokerage (%)</label>
                                    <input
                                      type="text"
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                      value={brokerage}
                                      onChange={(e) => setBrokerage(e.target.value)}
                                      disabled={!isProposingNewValues}
                                    />
                                  </div>
                                </div>
                                <div className="mt-4 text-sm text-gray-700">
                                  Total deductions: <span className="font-semibold">{totalDeductions}%</span>
                                </div>
                              </div>
                            )}

                            <div className="mt-8">
                              <label className="block text-sm font-medium text-gray-700">Quote Conditions & Comments</label>
                              <textarea
                                rows={4}
                                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="Enter any conditions or comments related to your quote..."
                              />
                            </div>

                            <div className="mt-8">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Documents</label>
                              <DocumentUpload
                                fileInputId="reinsurer-fac-supporting-nonprop"
                                bucketName="cedewise-documents"
                                folderPath={nonProportionalQuoteSupportingFolder}
                                multiple
                              />
                              <p className="mt-2 text-xs text-gray-500">
                                PDF, Word, Excel, images up to 10MB each
                              </p>
                            </div>

                            <div className="mt-8 flex justify-end space-x-3">
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Save Draft
                              </button>
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Submit Quote
                              </button>
                            </div>
                          </div>
                        </div>
                      </Tab.Panel>

                      {/* My Documents Panel */}
                      <Tab.Panel className="p-6">
                        <div className="space-y-6">
                          <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                              <h3 className="text-lg font-medium text-gray-900">Documents</h3>
                              <button
                                type="button"
                                onClick={() =>
                                  document.getElementById('reinsurer-fac-document-input-nonprop')?.click()
                                }
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                              >
                                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                                Upload Document
                              </button>
                            </div>
                            <div className="space-y-4">
                              {[
                                'Risk Assessment Report.pdf',
                                'Property Valuation.pdf',
                                'Safety Measures Documentation.pdf'
                              ].map((doc, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                  <div className="flex items-center">
                                    <DocumentIcon className="h-5 w-5 text-gray-400 mr-3" />
                                    <span className="text-sm font-medium text-gray-900">{doc}</span>
                                  </div>
                                  <button
                                    type="button"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                  >
                                    Download
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="mt-8 border-t border-gray-200 pt-6">
                              <h4 className="text-base font-medium text-gray-900 mb-4">Upload New Document</h4>
                              <DocumentUpload
                                fileInputId="reinsurer-fac-document-input-nonprop"
                                bucketName="cedewise-documents"
                                folderPath={nonProportionalDocFolder}
                                multiple
                              />
                              <p className="mt-2 text-xs text-gray-500">
                                PDF, Word, Excel, images up to 10MB each
                              </p>
                            </div>
                          </div>
                        </div>
                      </Tab.Panel>

                      {/* Risk Address Panel */}
                      <Tab.Panel className="p-6">
                        <div className="bg-white rounded-lg">
                          <div className="flex justify-between items-center mb-8">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">Risk Location Details</h3>
                              <p className="mt-1 text-sm text-gray-500">View and manage risk location information</p>
                            </div>
                            <div className="flex space-x-3">
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Edit
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-8">
                            {/* Address Information */}
                            <div className="bg-gray-50 rounded-lg p-6">
                              <h4 className="text-base font-medium text-gray-900 mb-4">Address Details</h4>
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                  <input
                                    type="text"
                                    defaultValue="123 Mining Road"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                  <input
                                    type="text"
                                    defaultValue="Tete"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Province/State</label>
                                  <input
                                    type="text"
                                    defaultValue="Tete Province"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                  <select
                                    defaultValue="Mozambique"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  >
                                    <option>Mozambique</option>
                                    <option>South Africa</option>
                                    <option>Namibia</option>
                                    <option>Botswana</option>
                                    <option>Zimbabwe</option>
                                    <option>Zambia</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* GPS Coordinates */}
                            <div className="bg-gray-50 rounded-lg p-6">
                              <h4 className="text-base font-medium text-gray-900 mb-4">GPS Coordinates</h4>
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                  <input
                                    type="text"
                                    defaultValue="-16.1549"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                  <input
                                    type="text"
                                    defaultValue="33.5868"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab.Panel>

                      {/* Currency Calculator Panel */}
                      <Tab.Panel className="p-6">
                        <div className="space-y-6">
                          <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Currency Converter & Calculator</h3>
                            
                            <div className="space-y-8">
                              {/* Currency Converter Section */}
                              <div className="bg-gray-50 p-6 rounded-lg">
                                <h4 className="text-base font-medium text-gray-900 mb-4">Currency Converter</h4>
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                    <input
                                      type="text"
                                      placeholder="Enter amount"
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">From Currency</label>
                                    <select
                                      defaultValue="USD"
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                      <option value="USD">USD - US Dollar</option>
                                      <option value="EUR">EUR - Euro</option>
                                      <option value="GBP">GBP - British Pound</option>
                                      <option value="ZAR">ZAR - South African Rand</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">To Currency</label>
                                    <select
                                      defaultValue="EUR"
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                      <option value="EUR">EUR - Euro</option>
                                      <option value="USD">USD - US Dollar</option>
                                      <option value="GBP">GBP - British Pound</option>
                                      <option value="ZAR">ZAR - South African Rand</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Converted Amount</label>
                                    <div className="mt-1 bg-gray-100 p-3 rounded-md border border-gray-200">
                                      0.00 EUR
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-6">
                                  <button
                                    type="button"
                                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    Convert Currency
                                  </button>
                                </div>
                              </div>

                              {/* Premium Calculator */}
                              <div className="bg-gray-50 rounded-lg p-6">
                                <h4 className="text-base font-medium text-gray-900 mb-4">Premium Calculator</h4>
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sum Insured</label>
                                    <div className="mt-1 bg-gray-100 p-3 rounded-md border border-gray-200">
                                      R 1,670,000,000 USD
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Premium Rate (%)</label>
                                    <div className="mt-1 bg-gray-100 p-3 rounded-md border border-gray-200">
                                      2.5%
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Calculated Premium</label>
                                    <div className="mt-1 bg-gray-100 p-3 rounded-md border border-gray-200">
                                      R 41,750,000
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                    <div className="mt-1 bg-gray-100 p-3 rounded-md border border-gray-200">
                                      USD
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </div>

              {/* Right Content - Chat */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex flex-col h-[calc(100vh-8rem)]">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Communication with Broker</h3>
                  </div>
                  <div className="p-4">
                    <Chat
                      submissionId={chatSubmissionId}
                      className="h-[calc(100vh-14rem)]"
                      participantLabels={{ broker: 'Broker', reinsurer: 'Reinsurer', insurer: 'Insurer' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* My Quotes Panel */}
          <Tab.Panel>
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">My Quotes</h2>
                    <p className="mt-1 text-sm text-gray-500">View and manage your submitted quotes</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search quotes..."
                        className="block w-64 rounded-md border-gray-300 pl-10 pr-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <select className="block w-40 rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
                      <option>All Quotes</option>
                      <option>Pending</option>
                      <option>Accepted</option>
                      <option>Declined</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden">
                <ul role="list" className="divide-y divide-gray-200">
                  <li>
                    <div className="px-6 py-5 hover:bg-gray-50 transition duration-150">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <p className="text-sm font-semibold text-blue-600 hover:text-blue-800">NPR-456789-1234</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="text-sm text-gray-500">Submitted 2 hours ago</p>
                          <button className="text-gray-400 hover:text-gray-500">
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Client</p>
                          <p className="mt-1 text-sm text-gray-900">Vulcan Mining Operations</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Insurance Type</p>
                          <p className="mt-1 text-sm text-gray-900">Property Insurance</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Share & Premium</p>
                          <p className="mt-1 text-sm text-gray-900">50% • R 41,750,000</p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="px-6 py-5 hover:bg-gray-50 transition duration-150">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <p className="text-sm font-semibold text-blue-600 hover:text-blue-800">NPR-456788-1233</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Accepted
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="text-sm text-gray-500">Submitted 1 day ago</p>
                          <button className="text-gray-400 hover:text-gray-500">
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Client</p>
                          <p className="mt-1 text-sm text-gray-900">Solar Energy Plant</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Insurance Type</p>
                          <p className="mt-1 text-sm text-gray-900">Engineering</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Share & Premium</p>
                          <p className="mt-1 text-sm text-gray-900">35% • R 28,500,000</p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="px-6 py-5 hover:bg-gray-50 transition duration-150">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <p className="text-sm font-semibold text-blue-600 hover:text-blue-800">NPR-456787-1232</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Declined
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="text-sm text-gray-500">Submitted 3 days ago</p>
                          <button className="text-gray-400 hover:text-gray-500">
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Client</p>
                          <p className="mt-1 text-sm text-gray-900">Coastal Port Facility</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Insurance Type</p>
                          <p className="mt-1 text-sm text-gray-900">Marine</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Share & Premium</p>
                          <p className="mt-1 text-sm text-gray-900">25% • R 15,250,000</p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                
                <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of{' '}
                        <span className="font-medium">12</span> quotes
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-600 hover:bg-gray-50">
                          1
                        </button>
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          2
                        </button>
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          3
                        </button>
                        <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
} 