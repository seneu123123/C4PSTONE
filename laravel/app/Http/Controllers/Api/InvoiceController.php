<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\Booking;
use Illuminate\Support\Facades\Log;

class InvoiceController extends Controller
{
    /**
     * Show official invoice details
     */
    public function show($id)
    {
        $invoice = Invoice::with('booking')->where('id', $id)->orWhere('invoice_number', $id)->first();
        if (!$invoice) {
            return response()->json(['status' => 'error', 'message' => 'Invoice not found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $invoice
        ]);
    }

    /**
     * Record a customer payment / deposit against an invoice
     */
    public function recordPayment(Request $request, $id)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|string|in:GCash,Maya,Bank Transfer,Credit Card,Cash',
            'reference_number' => 'required|string|max:80',
            'payment_date' => 'nullable|date',
            'notes' => 'nullable|string|max:255'
        ]);

        $invoice = Invoice::where('id', $id)->orWhere('invoice_number', $id)->first();
        if (!$invoice) {
            return response()->json(['status' => 'error', 'message' => 'Invoice not found'], 404);
        }

        $payments = $invoice->payments ?? [];
        $paymentRecord = [
            'id' => 'PAY-' . rand(10000, 99999),
            'amount' => (float) $validated['amount'],
            'method' => $validated['payment_method'],
            'reference' => $validated['reference_number'],
            'date' => $validated['payment_date'] ?? now()->toDateString(),
            'notes' => $validated['notes'] ?? '',
            'recorded_by' => $request->user()->email ?? 'Staff'
        ];

        $payments[] = $paymentRecord;
        $newAmountPaid = array_reduce($payments, fn($sum, $p) => $sum + $p['amount'], 0);
        $newBalance = max(0, $invoice->total_amount - $newAmountPaid);
        $newStatus = $newBalance <= 0 ? 'Paid' : ($newAmountPaid > 0 ? 'Partial' : 'Unpaid');

        $invoice->payments = $payments;
        $invoice->amount_paid = $newAmountPaid;
        $invoice->balance_due = $newBalance;
        $invoice->status = $newStatus;
        $invoice->save();

        // Update corresponding booking payment status
        if ($invoice->booking) {
            $invoice->booking->payment_status = $newStatus === 'Paid' ? 'Paid' : 'Partial';
            $invoice->booking->save();
        }

        Log::info("Payment Recorded [Invoice: {$invoice->invoice_number}]: ₱{$validated['amount']} via {$validated['payment_method']}", [
            'ref' => $validated['reference_number'],
            'recorded_by' => $request->user()->email,
            'balance_remaining' => $newBalance
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Payment successfully recorded and ledger updated.',
            'data' => $invoice
        ]);
    }
}
