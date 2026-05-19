import ExcelJS from 'exceljs';

export type FacQuoteType = 'proportional' | 'non-proportional';

export interface QuoteExportField {
  label: string;
  value: string;
}

export interface QuoteExportSection {
  title: string;
  fields: QuoteExportField[];
}

export interface FacQuoteExportPayload {
  facType: FacQuoteType;
  reference: string;
  exportedAt: string;
  sections: QuoteExportSection[];
}

export function getFacQuoteTitle(facType: FacQuoteType): string {
  return facType === 'proportional'
    ? 'Proportional Facultative Reinsurance'
    : 'Non-Proportional Facultative Reinsurance';
}

export function buildEmailSubject(payload: FacQuoteExportPayload): string {
  const title = getFacQuoteTitle(payload.facType);
  return `[Cedewise] ${title} Quote — ${payload.reference || 'Submission'}`;
}

export function formatQuoteAsPlainText(payload: FacQuoteExportPayload): string {
  const lines: string[] = [
    getFacQuoteTitle(payload.facType),
    `Reference: ${payload.reference || '—'}`,
    `Exported: ${payload.exportedAt}`,
    '',
  ];

  for (const section of payload.sections) {
    lines.push(section.title.toUpperCase());
    lines.push('—'.repeat(Math.min(section.title.length, 40)));
    for (const field of section.fields) {
      lines.push(`${field.label}: ${field.value || '—'}`);
    }
    lines.push('');
  }

  return lines.join('\n').trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildQuotePrintHtml(payload: FacQuoteExportPayload): string {
  const title = getFacQuoteTitle(payload.facType);
  const sectionsHtml = payload.sections
    .map(
      (section) => `
      <section class="section">
        <h2>${escapeHtml(section.title)}</h2>
        <table>
          <tbody>
            ${section.fields
              .map(
                (f) => `
              <tr>
                <th>${escapeHtml(f.label)}</th>
                <td>${escapeHtml(f.value || '—')}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </section>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)} — ${escapeHtml(payload.reference)}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; color: #111; margin: 32px; font-size: 12px; }
    h1 { font-size: 20px; margin: 0 0 4px; color: #1e40af; }
    .meta { color: #6b7280; margin-bottom: 24px; font-size: 11px; }
    .section { margin-bottom: 20px; page-break-inside: avoid; }
    h2 { font-size: 13px; margin: 0 0 8px; padding-bottom: 4px; border-bottom: 2px solid #2563eb; color: #1e3a8a; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 6px 10px; border: 1px solid #e5e7eb; vertical-align: top; }
    th { width: 38%; background: #f9fafb; font-weight: 600; color: #374151; }
    td { color: #111827; }
    @media print { body { margin: 16px; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p class="meta">Reference: <strong>${escapeHtml(payload.reference || '—')}</strong> · Exported ${escapeHtml(payload.exportedAt)}</p>
  ${sectionsHtml}
  <script>window.onload = function() { window.print(); };</script>
</body>
</html>`;
}

export async function exportQuoteToExcel(
  payload: FacQuoteExportPayload,
  fileName: string
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Quote');

  const title = getFacQuoteTitle(payload.facType);
  sheet.addRow([title]);
  sheet.addRow(['Reference', payload.reference || '—']);
  sheet.addRow(['Exported', payload.exportedAt]);
  sheet.addRow([]);

  for (const section of payload.sections) {
    sheet.addRow([section.title]);
    sheet.addRow(['Field', 'Value']);
    for (const field of section.fields) {
      sheet.addRow([field.label, field.value || '—']);
    }
    sheet.addRow([]);
  }

  sheet.getRow(1).font = { bold: true, size: 14 };
  sheet.columns = [{ width: 36 }, { width: 48 }];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${fileName}.xlsx`;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

export function exportQuoteToPdf(payload: FacQuoteExportPayload): void {
  const html = buildQuotePrintHtml(payload);
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
  if (!printWindow) {
    window.alert('Please allow pop-ups to export the quote as PDF.');
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
}

export function exportQuoteToEmail(
  payload: FacQuoteExportPayload,
  recipientEmail?: string
): void {
  const subject = encodeURIComponent(buildEmailSubject(payload));
  const body = encodeURIComponent(formatQuoteAsPlainText(payload));
  const to = recipientEmail ? encodeURIComponent(recipientEmail) : '';
  const mailto = `mailto:${to}?subject=${subject}&body=${body}`;
  window.location.href = mailto;
}

export function buildQuoteFileName(facType: FacQuoteType, reference: string): string {
  const prefix = facType === 'proportional' ? 'Proportional_FAC_Quote' : 'Non_Proportional_FAC_Quote';
  const ref = (reference || 'submission').replace(/[^a-zA-Z0-9-_]+/g, '_');
  return `${prefix}_${ref}`;
}

function str(value: unknown): string {
  if (value === null || value === undefined || value === '') return '';
  return String(value);
}

export interface BuildFacQuoteExportArgs {
  facType: FacQuoteType;
  submission: Record<string, unknown>;
  quote: {
    shareOffer: string;
    quotePremiumAmount: string;
    quotePremiumRate: string;
    layer?: string;
    excessOf?: string;
    commission: string;
    overrider: string;
    brokerage: string;
    deductionsPreset: 'option1' | 'option2';
    totalDeductions: string;
    quoteConditions: string;
    isProposingNewValues: boolean;
    premiumAtShareDisplay: string;
    premiumRateDisplay: string;
    premium100Display: string;
    sumInsuredFormatted: string;
  };
}

export function buildFacQuoteExportPayload(args: BuildFacQuoteExportArgs): FacQuoteExportPayload {
  const { facType, submission, quote } = args;
  const reference =
    str(submission.policyReferenceNumber) ||
    str(submission.policyNo) ||
    str(submission.reference) ||
    '—';

  const deductionsLabel =
    quote.deductionsPreset === 'option1'
      ? 'Commission 20%, Overrider 2.5%, Brokerage 2.5% (Total 25%)'
      : 'FOC (Free of Commission)';

  const submissionFields: QuoteExportField[] = [
    { label: 'Ceding Company', value: str(submission.company ?? submission.cedingCompany) },
    { label: 'Insured', value: str(submission.insured ?? submission.insuredName) },
    { label: 'Policy Reference', value: reference },
    { label: 'Broker', value: str(submission.brokerName ?? submission.broker) },
    { label: 'Class of Business', value: str(submission.classOfBusiness) },
    { label: 'Business Occupation', value: str(submission.businessOccupation) },
    { label: 'Risk Country', value: str(submission.riskCountry) },
    { label: 'Quote Required (%)', value: str(submission.quoteRequiredPercentage) },
    { label: 'Physical Damage', value: str(submission.physicalDamage) },
    { label: 'Business Interruption', value: str(submission.businessInterruption) },
    { label: 'Sum Insured', value: str(submission.sumInsured) },
    { label: 'Remaining Share (%)', value: str(submission.remainingShare) },
    { label: 'Broker Premium Rate (%)', value: str(submission.premiumRate) },
    { label: 'Broker Premium Amount', value: str(submission.premiumAmount) },
    { label: 'Start Date', value: str(submission.startDate) },
    { label: 'End Date', value: str(submission.endDate) },
    { label: 'Description', value: str(submission.description) },
  ];

  if (facType === 'non-proportional') {
    submissionFields.push(
      { label: 'Reinsurance Layer', value: str(submission.reinsuranceLayer) },
      { label: 'Primary Layer', value: str(submission.primaryLayer) },
      { label: 'Excess Layer', value: str(submission.excessLayer) }
    );
  }

  const quoteFields: QuoteExportField[] = [
    { label: 'Quote Mode', value: quote.isProposingNewValues ? 'Propose New Values' : 'Accept Broker Values' },
    { label: 'Share Offer (%)', value: quote.shareOffer },
    { label: 'Sum Insured Amount', value: quote.sumInsuredFormatted },
    { label: 'Premium', value: quote.quotePremiumAmount ? `R ${quote.quotePremiumAmount}` : '' },
    { label: 'Rate (%)', value: quote.quotePremiumRate },
    { label: 'Premium at Share Offer', value: quote.premiumAtShareDisplay },
    { label: 'Premium Rate (calculated)', value: quote.premiumRateDisplay },
    { label: '100% Premium', value: quote.premium100Display },
    { label: 'Total Deductions Preset', value: deductionsLabel },
    { label: 'Commission (%)', value: quote.commission },
    { label: 'Overrider (%)', value: quote.overrider },
    { label: 'Brokerage (%)', value: quote.brokerage },
    { label: 'Total Deductions (%)', value: quote.totalDeductions },
    { label: 'Quote Conditions & Comments', value: quote.quoteConditions },
  ];

  if (facType === 'non-proportional') {
    quoteFields.splice(
      4,
      0,
      { label: 'Layer', value: quote.layer ? `R ${quote.layer}` : '' },
      { label: 'In Excess Of', value: quote.excessOf ? `R ${quote.excessOf}` : '' }
    );
  }

  return {
    facType,
    reference,
    exportedAt: new Date().toLocaleString(),
    sections: [
      { title: 'Submission Details', fields: submissionFields },
      { title: 'Reinsurer Quote', fields: quoteFields },
    ],
  };
}
