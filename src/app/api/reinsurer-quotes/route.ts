import { NextRequest, NextResponse } from 'next/server';
import {
  addSubmittedQuote,
  listSubmittedQuotes,
  type FacQuoteType,
  type SubmittedReinsurerQuote,
} from '@/lib/quoteStore';

export const runtime = 'nodejs';

function parseBrokerEmails(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((e) => (typeof e === 'string' ? e.trim() : ''))
    .filter((e) => e.includes('@'));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const submissionId = searchParams.get('submissionId') ?? undefined;
  const brokerEmail = searchParams.get('brokerEmail') ?? undefined;
  const facType = searchParams.get('facType') as FacQuoteType | null;

  const quotes = listSubmittedQuotes({
    submissionId,
    brokerEmail,
    facType: facType === 'proportional' || facType === 'non-proportional' ? facType : undefined,
  });

  return NextResponse.json({ success: true, quotes });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const submissionId = String(body.submissionId ?? '').trim();
    const facType = body.facType as FacQuoteType;

    if (!submissionId) {
      return NextResponse.json({ success: false, error: 'submissionId is required' }, { status: 400 });
    }
    if (facType !== 'proportional' && facType !== 'non-proportional') {
      return NextResponse.json({ success: false, error: 'Invalid facType' }, { status: 400 });
    }
    if (!body.quote || typeof body.quote !== 'object') {
      return NextResponse.json({ success: false, error: 'quote payload is required' }, { status: 400 });
    }

    const shareOffer = String(body.quote.shareOffer ?? '').trim();
    if (!shareOffer) {
      return NextResponse.json(
        { success: false, error: 'Share offer (%) is required before submitting' },
        { status: 400 }
      );
    }

    const brokerEmails = parseBrokerEmails(body.brokerEmails);
    const quote: SubmittedReinsurerQuote = {
      id: `quote-${submissionId}-${facType}-${Date.now()}`,
      submissionId,
      facType,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      reinsurerName: String(body.reinsurerName ?? 'Emeritus Re'),
      brokerName: String(body.brokerName ?? body.broker ?? 'Broker'),
      brokerEmails,
      reference: String(body.reference ?? body.policyReference ?? submissionId),
      insured: String(body.insured ?? ''),
      cedingCompany: String(body.cedingCompany ?? body.company ?? ''),
      quote: {
        shareOffer,
        quotePremiumAmount: String(body.quote.quotePremiumAmount ?? ''),
        quotePremiumRate: String(body.quote.quotePremiumRate ?? ''),
        layer: body.quote.layer ? String(body.quote.layer) : undefined,
        excessOf: body.quote.excessOf ? String(body.quote.excessOf) : undefined,
        commission: String(body.quote.commission ?? ''),
        overrider: String(body.quote.overrider ?? ''),
        brokerage: String(body.quote.brokerage ?? ''),
        totalDeductions: String(body.quote.totalDeductions ?? ''),
        deductionsPreset: String(body.quote.deductionsPreset ?? ''),
        quoteConditions: String(body.quote.quoteConditions ?? ''),
        isProposingNewValues: Boolean(body.quote.isProposingNewValues),
        premiumAtShareDisplay: String(body.quote.premiumAtShareDisplay ?? ''),
        premiumRateDisplay: String(body.quote.premiumRateDisplay ?? ''),
        premium100Display: String(body.quote.premium100Display ?? ''),
        sumInsuredFormatted: String(body.quote.sumInsuredFormatted ?? ''),
      },
      submissionSnapshot:
        body.submissionSnapshot && typeof body.submissionSnapshot === 'object'
          ? body.submissionSnapshot
          : {},
    };

    addSubmittedQuote(quote);

    return NextResponse.json({ success: true, quote });
  } catch (e) {
    console.error('[reinsurer-quotes POST]', e);
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Failed to submit quote' },
      { status: 500 }
    );
  }
}
