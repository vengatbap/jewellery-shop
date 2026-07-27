'use client';

import { FormEvent, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type ApiState = 'idle' | 'loading' | 'success' | 'error';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors?: Array<{ code: string; message: string }>;
}

interface InventoryItem {
    inventory_item_id: string;
    product_name: string;
    category: string;
    purity: string;
    gross_weight: number;
    net_weight: number;
    stone_weight: number;
    making_charge: number;
    wastage_percent: number;
    status: string;
}

interface Customer {
    customer_id: string;
    customer_code: string;
    name: string;
    phone: string;
    status: string;
}

interface Rate {
    metal: string;
    purity: string;
    currency: string;
    rate_per_gram: number;
    effective_at: string;
}

interface InvoicePayload {
    invoice: {
        invoice_number: string;
        customer_name: string | null;
        product_name: string;
        gold_rate: number;
        subtotal: number;
        tax_amount: number;
        grand_total: number;
        payment_status: string;
    };
    pricing: {
        goldValue: number;
        wastageAmount: number;
        makingCharge: number;
        subtotal: number;
        taxAmount: number;
        grandTotal: number;
    };
    journal_entry: {
        entry_number: string;
        lines: Array<{
            line_id: string;
            account_code: string;
            account_name: string;
            debit: number;
            credit: number;
        }>;
    };
}

const inventoryUrl = 'http://localhost:4003';
const customerUrl = 'http://localhost:4005';
const goldRateUrl = 'http://localhost:4006';
const billingUrl = 'http://localhost:4004';
const accountingUrl = 'http://localhost:4007';

export default function Page() {
    const [barcode, setBarcode] = useState('JR000123');
    const [customerId, setCustomerId] = useState('customer-demo-001');
    const [taxPercent, setTaxPercent] = useState('3');
    const [paymentStatus, setPaymentStatus] = useState('paid');
    const [status, setStatus] = useState<ApiState>('idle');
    const [message, setMessage] = useState('');
    const [inventoryItem, setInventoryItem] = useState<InventoryItem | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [rate, setRate] = useState<Rate | null>(null);
    const [invoice, setInvoice] = useState<InvoicePayload | null>(null);
    const [journals, setJournals] = useState<InvoicePayload['journal_entry'][]>([]);

    const canInvoice = useMemo(
        () => inventoryItem?.status === 'in_stock' || inventoryItem?.status === 'reserved',
        [inventoryItem]
    );

    async function lookupBarcode(event?: FormEvent) {
        event?.preventDefault();
        setStatus('loading');
        setMessage('Looking up inventory, customer, and gold rate...');
        setInvoice(null);

        try {
            const item = await apiGet<InventoryItem>(
                `${inventoryUrl}/inventory/items/barcode/${encodeURIComponent(barcode)}`
            );
            const selectedCustomer = await apiGet<Customer>(
                `${customerUrl}/customers/${encodeURIComponent(customerId)}`
            );
            const currentRate = await apiGet<Rate>(
                `${goldRateUrl}/gold-rates/current?metal=gold&purity=${encodeURIComponent(item.purity)}`
            );

            setInventoryItem(item);
            setCustomer(selectedCustomer);
            setRate(currentRate);
            setStatus('success');
            setMessage('Ready for billing.');
        } catch (error) {
            setStatus('error');
            setMessage(error instanceof Error ? error.message : 'Lookup failed');
        }
    }

    async function createInvoice() {
        setStatus('loading');
        setMessage('Creating invoice and posting stock/accounting movements...');

        try {
            const payload = await apiPost<InvoicePayload>(`${billingUrl}/billing/invoices`, {
                barcode,
                customer_id: customerId,
                tax_percent: Number(taxPercent),
                payment_status: paymentStatus,
            });

            const journalList = await apiGet<InvoicePayload['journal_entry'][]>(
                `${accountingUrl}/accounting/journals`
            );
            const latestItem = await apiGet<InventoryItem>(
                `${inventoryUrl}/inventory/items/barcode/${encodeURIComponent(barcode)}`
            );

            setInvoice(payload);
            setJournals(journalList);
            setInventoryItem(latestItem);
            setStatus('success');
            setMessage('Invoice completed. Stock is sold and accounting journal is posted.');
        } catch (error) {
            setStatus('error');
            setMessage(error instanceof Error ? error.message : 'Invoice failed');
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-950">
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Jewellery ERP</h1>
                        <p className="text-sm text-slate-500">POS microservice workbench</p>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs lg:grid-cols-7">
                        <ServicePill label="Inventory" port="4003" />
                        <ServicePill label="Billing" port="4004" />
                        <ServicePill label="Customers" port="4005" />
                        <ServicePill label="Rates" port="4006" />
                        <ServicePill label="Accounting" port="4007" />
                        <ServicePill label="Procurement" port="4008" />
                        <ServicePill label="Repairs" port="4009" />
                    </div>
                </div>
            </div>

            <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[380px_1fr]">
                <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-semibold">Billing Input</h2>
                    <form className="mt-5 space-y-4" onSubmit={lookupBarcode}>
                        <Field label="Barcode">
                            <input
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                                value={barcode}
                                onChange={(event) => setBarcode(event.target.value)}
                            />
                        </Field>
                        <Field label="Customer ID">
                            <input
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                                value={customerId}
                                onChange={(event) => setCustomerId(event.target.value)}
                            />
                        </Field>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Tax %">
                                <input
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                                    value={taxPercent}
                                    onChange={(event) => setTaxPercent(event.target.value)}
                                />
                            </Field>
                            <Field label="Payment">
                                <select
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                                    value={paymentStatus}
                                    onChange={(event) => setPaymentStatus(event.target.value)}
                                >
                                    <option value="paid">Paid</option>
                                    <option value="unpaid">Unpaid</option>
                                </select>
                            </Field>
                        </div>
                        <button
                            className="w-full rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                            type="submit"
                        >
                            Scan / Lookup
                        </button>
                        <button
                            className="w-full rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                            type="button"
                            disabled={!canInvoice || status === 'loading'}
                            onClick={createInvoice}
                        >
                            Create Invoice
                        </button>
                    </form>
                    <div className={`mt-4 rounded-md px-3 py-2 text-sm ${statusClass(status)}`}>
                        {message || 'Enter a barcode to begin.'}
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="grid gap-4 lg:grid-cols-3">
                        <InfoCard title="Inventory Item">
                            {inventoryItem ? (
                                <dl className="space-y-2 text-sm">
                                    <Row label="Product" value={inventoryItem.product_name} />
                                    <Row label="Category" value={inventoryItem.category} />
                                    <Row label="Purity" value={inventoryItem.purity} />
                                    <Row label="Net Weight" value={`${inventoryItem.net_weight} g`} />
                                    <Row label="Status" value={inventoryItem.status} />
                                </dl>
                            ) : (
                                <Empty text="No item loaded" />
                            )}
                        </InfoCard>
                        <InfoCard title="Customer">
                            {customer ? (
                                <dl className="space-y-2 text-sm">
                                    <Row label="Name" value={customer.name} />
                                    <Row label="Code" value={customer.customer_code} />
                                    <Row label="Phone" value={customer.phone} />
                                    <Row label="Status" value={customer.status} />
                                </dl>
                            ) : (
                                <Empty text="No customer loaded" />
                            )}
                        </InfoCard>
                        <InfoCard title="Gold Rate">
                            {rate ? (
                                <dl className="space-y-2 text-sm">
                                    <Row label="Metal" value={rate.metal} />
                                    <Row label="Purity" value={rate.purity} />
                                    <Row label="Rate / gram" value={money(rate.rate_per_gram)} />
                                    <Row label="Currency" value={rate.currency} />
                                </dl>
                            ) : (
                                <Empty text="No rate loaded" />
                            )}
                        </InfoCard>
                    </div>

                    <InfoCard title="Invoice Result">
                        {invoice ? (
                            <div className="grid gap-6 lg:grid-cols-2">
                                <dl className="space-y-2 text-sm">
                                    <Row label="Invoice" value={invoice.invoice.invoice_number} />
                                    <Row label="Customer" value={invoice.invoice.customer_name ?? '-'} />
                                    <Row label="Product" value={invoice.invoice.product_name} />
                                    <Row label="Gold value" value={money(invoice.pricing.goldValue)} />
                                    <Row label="Wastage" value={money(invoice.pricing.wastageAmount)} />
                                    <Row label="Tax" value={money(invoice.pricing.taxAmount)} />
                                    <Row label="Grand total" value={money(invoice.pricing.grandTotal)} strong />
                                </dl>
                                <div className="rounded-md border border-slate-200">
                                    <div className="border-b border-slate-200 px-3 py-2 text-sm font-medium">
                                        Journal {invoice.journal_entry.entry_number}
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {invoice.journal_entry.lines.map((line) => (
                                            <div className="grid grid-cols-[1fr_80px_80px] gap-2 px-3 py-2 text-sm" key={line.line_id ?? line.account_code}>
                                                <span>{line.account_name}</span>
                                                <span className="text-right">{line.debit ? money(line.debit) : '-'}</span>
                                                <span className="text-right">{line.credit ? money(line.credit) : '-'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Empty text="No invoice created yet" />
                        )}
                    </InfoCard>

                    <InfoCard title="Accounting Journal Count">
                        <p className="text-sm text-slate-600">{journals.length} journal entries posted in this Accounting service session.</p>
                    </InfoCard>
                </section>
            </div>
        </main>
    );
}

function ServicePill({ label, port }: { label: string; port: string }) {
    return (
        <div className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-center">
            <div className="font-medium">{label}</div>
            <div className="text-slate-500">:{port}</div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
            {children}
        </label>
    );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
    return (
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold">{title}</h2>
            {children}
        </article>
    );
}

function Row({ label, value, strong = false }: { label: string; value: string | number; strong?: boolean }) {
    return (
        <div className="flex justify-between gap-4">
            <dt className="text-slate-500">{label}</dt>
            <dd className={strong ? 'font-semibold text-slate-950' : 'font-medium text-slate-800'}>{value}</dd>
        </div>
    );
}

function Empty({ text }: { text: string }) {
    return <p className="text-sm text-slate-500">{text}</p>;
}

function statusClass(status: ApiState) {
    if (status === 'success') return 'bg-emerald-50 text-emerald-800';
    if (status === 'error') return 'bg-red-50 text-red-800';
    if (status === 'loading') return 'bg-amber-50 text-amber-800';
    return 'bg-slate-100 text-slate-600';
}

async function apiGet<T>(url: string): Promise<T> {
    const response = await fetch(url);
    const payload = (await response.json()) as ApiResponse<T>;
    if (!response.ok || !payload.success) {
        throw new Error(payload.message || `Request failed: ${url}`);
    }
    return payload.data;
}

async function apiPost<T>(url: string, body: unknown): Promise<T> {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    });
    const payload = (await response.json()) as ApiResponse<T>;
    if (!response.ok || !payload.success) {
        throw new Error(payload.message || `Request failed: ${url}`);
    }
    return payload.data;
}

function money(value: number) {
    return new Intl.NumberFormat('en-BH', {
        style: 'currency',
        currency: 'BHD',
        maximumFractionDigits: 3,
    }).format(value);
}
