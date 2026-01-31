import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CsvImportModal } from './CsvImportModal';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Papa from 'papaparse';

// Mock dependencies
vi.mock('papaparse', () => ({
  default: {
    parse: vi.fn(),
  },
}));

const mockTrackEvent = vi.fn();
vi.mock('../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: mockTrackEvent,
  }),
}));

const mockAddBulkRecords = vi.fn();
vi.mock('../contexts/financial-record-context', () => ({
  useFinancialRecords: () => ({
    addBulkRecords: mockAddBulkRecords,
  }),
}));

describe('CsvImportModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(<CsvImportModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Import Transactions from CSV')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    const { container } = render(<CsvImportModal isOpen={false} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('retries with comma delimiter when auto-detection fails', async () => {
    render(<CsvImportModal isOpen={true} onClose={() => {}} />);

    const file = new File(['date,amount,category'], 'test.csv', { type: 'text/csv' });
    // The input is hidden, so we need to find it by direct selector or test ID if available.
    // Since it is inside the component, we can use container querySelector or getByLabelText if properly associated.
    // In the component, aria-label is on the parent div.
    // Let's use checking for the input type file.
    const input = screen.getByLabelText(/upload/i).querySelector('input') || document.createElement('input');

    // Mock Papa.parse implementation
    const parseMock = Papa.parse as any;

    // First call simulates failure (e.g. TooManyFields or just bad parsing)
    parseMock.mockImplementationOnce((_file: any, config: any) => {
       // Verify first call is auto-detect (no delimiter)
       if (config.delimiter) {
           throw new Error('First call should not have explicit delimiter');
       }

       // Simulate error callback or "bad" data
       // The component logic we plan to write will look for errors or single field
       config.complete({
           data: [],
           errors: [{ code: 'TooManyFields', message: 'Too many fields' }],
           meta: { fields: ['date'] } // Simulate weird parsing
       });
    });

    // Second call simulates success with comma
    parseMock.mockImplementationOnce((_file: any, config: any) => {
        // Verify second call has comma delimiter
        expect(config.delimiter).toBe(',');

        config.complete({
            data: [
                { date: '2023-01-01', amount: '-4500', category: 'Rent', description: 'Rent Payment' }
            ],
            errors: [],
            meta: { fields: ['date', 'amount', 'category', 'description'] }
        });
    });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
        expect(parseMock).toHaveBeenCalledTimes(2);
    });

    // Check if the row was validated and displayed
    // It should be negative amount -> expense
    expect(screen.getByText('-4500')).toBeInTheDocument();

    // Check validation stats
    expect(screen.getByText('1')).toBeInTheDocument(); // 1 Valid Record
  });

  it('validates negative amounts as expenses', async () => {
    render(<CsvImportModal isOpen={true} onClose={() => {}} />);
    const file = new File(['dummy'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText(/upload/i).querySelector('input') || document.createElement('input');

    const parseMock = Papa.parse as any;
    parseMock.mockImplementation((_file: any, config: any) => {
        config.complete({
            data: [
                { date: '2023-01-01', amount: '-150.50', category: 'Groceries' }
            ],
            errors: [],
            meta: { fields: ['date', 'amount', 'category'] }
        });
    });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
        expect(screen.getByText('-150.50')).toBeInTheDocument();
    });

    // We can't easily inspect the internal "payload" without triggering import
    // But we know if it shows up in "Valid Records", it passed validation.
    // Let's click import and check the payload passed to addBulkRecords

    const importBtn = screen.getByText(/Import 1 Records/);
    fireEvent.click(importBtn);

    await waitFor(() => {
        expect(mockAddBulkRecords).toHaveBeenCalledWith([
            expect.objectContaining({
                amount: 150.50,
                type: 'expense',
                category: 'Groceries'
            })
        ]);
    });
  });

  it('rejects zero amounts', async () => {
    render(<CsvImportModal isOpen={true} onClose={() => {}} />);
    const file = new File(['dummy'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText(/upload/i).querySelector('input') || document.createElement('input');

    const parseMock = Papa.parse as any;
    parseMock.mockImplementation((_file: any, config: any) => {
        config.complete({
            data: [
                { date: '2023-01-01', amount: '0', category: 'Test' }
            ],
            errors: [],
            meta: { fields: ['date', 'amount', 'category'] }
        });
    });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
        // Should appear in invalid count
        // "Invalid Rows (Skipped)" text is in the component
        // The count is in a sibling div
        expect(screen.getByText('Invalid Rows (Skipped)')).toBeInTheDocument();
    });

    // We expect 1 invalid row
    const invalidCount = screen.getAllByText('1'); // One for Valid (0) one for Invalid (1)? No.
    // Actually valid is 0. Invalid is 1.
    // Let's look for specific error text

    // Hovering shows errors, but that's hard to test with hover state.
    // But the row should be rendered with error styling.
    // The component renders `row.errors.join(', ')` in a hidden div that appears on hover.
    // But we can search for the text "Amount must be a non-zero number" if it's in the DOM.
    expect(screen.getByText('Amount must be a non-zero number')).toBeInTheDocument();
  });
});
