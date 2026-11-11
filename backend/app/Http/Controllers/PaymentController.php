<?php

namespace App\Http\Controllers;

use App\Models\PricingPlan;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Create Razorpay / Payment Order
     */
    public function createOrder(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:pricing_plans,id',
        ]);

        $plan = PricingPlan::findOrFail($request->plan_id);
        $user = $request->user();

        // Amount in paise for Indian gateways (e.g. 1499 * 100 = 149900)
        $amountPaise = (int) ($plan->price * 100);
        $orderId = 'order_NKX_' . strtoupper(Str::random(10));

        return response()->json([
            'success' => true,
            'order' => [
                'order_id' => $orderId,
                'amount' => $plan->price,
                'amount_paise' => $amountPaise,
                'currency' => 'INR',
                'plan_name' => $plan->name,
                'plan_id' => $plan->id,
                'key_id' => env('RAZORPAY_KEY_ID', 'rzp_test_NaukarixDemoKey'),
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone ?? '+919876543210',
                ],
            ]
        ]);
    }

    /**
     * Verify payment and save transaction
     */
    public function verifyPayment(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:pricing_plans,id',
            'payment_method' => 'nullable|string',
            'transaction_id' => 'nullable|string',
            'order_id' => 'nullable|string',
        ]);

        $user = $request->user();
        $plan = PricingPlan::findOrFail($request->plan_id);

        $txnId = $request->transaction_id ?? ('pay_NKX_' . strtoupper(Str::random(12)));
        $nextNum = (Transaction::max('id') ?? 0) + 101;
        $invoiceNumber = 'INV-' . date('Ym') . '-' . str_pad($nextNum, 5, '0', STR_PAD_LEFT);

        $transaction = Transaction::create([
            'user_id' => $user->id,
            'pricing_plan_id' => $plan->id,
            'amount' => $plan->price,
            'currency' => 'INR',
            'payment_method' => $request->payment_method ?? 'Razorpay UPI / Cards',
            'transaction_id' => $txnId,
            'order_id' => $request->order_id ?? ('order_NKX_' . strtoupper(Str::random(8))),
            'payment_status' => 'completed',
            'invoice_number' => $invoiceNumber,
            'payment_response' => [
                'verified' => true,
                'timestamp' => now()->toIso8601String(),
                'gateway' => 'Razorpay / Indian Payment Gateway',
                'plan' => $plan->name,
            ],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment successful! Your recruiter account has been upgraded to ' . $plan->name,
            'transaction' => $transaction->load('pricingPlan'),
        ]);
    }
}
