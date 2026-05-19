'use client';

import React, { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import {
  buildQuoteFileName,
  exportQuoteToEmail,
  exportQuoteToExcel,
  exportQuoteToPdf,
  type FacQuoteExportPayload,
} from '@/lib/quoteExport';

interface QuoteExportMenuProps {
  payload: FacQuoteExportPayload;
  recipientEmail?: string;
  className?: string;
}

export default function QuoteExportMenu({
  payload,
  recipientEmail,
  className = '',
}: QuoteExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTo, setEmailTo] = useState(recipientEmail ?? '');

  const fileName = buildQuoteFileName(payload.facType, payload.reference);

  const runExport = async (action: 'excel' | 'pdf' | 'email', email?: string) => {
    setIsExporting(true);
    try {
      if (action === 'excel') {
        await exportQuoteToExcel(payload, fileName);
      } else if (action === 'pdf') {
        exportQuoteToPdf(payload);
      } else {
        exportQuoteToEmail(payload, email);
        setShowEmailModal(false);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailExport = () => {
    if (recipientEmail) {
      void runExport('email', recipientEmail);
      return;
    }
    setEmailTo('');
    setShowEmailModal(true);
  };

  return (
    <>
      <Menu as="div" className={`relative inline-block text-left ${className}`}>
        <Menu.Button
          type="button"
          disabled={isExporting}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60"
        >
          <ArrowDownTrayIcon className="h-4 w-4 text-gray-500" aria-hidden />
          Export
          <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={handleEmailExport}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } group flex w-full items-center gap-3 px-4 py-2 text-sm`}
                  >
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" aria-hidden />
                    Export to Email
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => void runExport('pdf')}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } group flex w-full items-center gap-3 px-4 py-2 text-sm`}
                  >
                    <DocumentTextIcon className="h-4 w-4 text-gray-400" aria-hidden />
                    Export to PDF
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => void runExport('excel')}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } group flex w-full items-center gap-3 px-4 py-2 text-sm`}
                  >
                    <TableCellsIcon className="h-4 w-4 text-gray-400" aria-hidden />
                    Export to Excel
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900">Send quote by email</h3>
            <p className="mt-1 text-sm text-gray-500">
              The full quote form will open in your email client as the message body.
            </p>
            <label className="mt-4 block text-sm font-medium text-gray-700" htmlFor="quote-export-email">
              Recipient email
            </label>
            <input
              id="quote-export-email"
              type="email"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              placeholder="broker@example.com"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!emailTo.trim() || isExporting}
                onClick={() => void runExport('email', emailTo.trim())}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Open in email
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
