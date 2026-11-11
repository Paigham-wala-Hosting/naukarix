'use client';

import React, { useState } from 'react';
import { PricingPlan, Transaction, api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  QrCode, 
  Smartphone,
  Check,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  plan: PricingPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (transaction: Transaction) => void;
}

export default function PaymentModal({ plan, isOpen, onClose, onPaymentSuccess }: PaymentModalProps) {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('recruiter@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [loading, setLoading] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !plan) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Create order
      const orderRes = await api.createCheckoutOrder(plan.id);
      
      // 2. Simulate gateway payment process (Razorpay signature verification)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // 3. Verify payment on Laravel backend
      const verifyRes = await api.verifyPayment({
        plan_id: plan.id,
        order_id: orderRes.order.order_id,
        payment_method: paymentMethod === 'upi' ? `UPI (${upiId})` : 'Credit/Debit Card',
        transaction_id: 'pay_NKX_' + Math.random().toString(36).substring(2, 12).toUpperCase(),
      });

      setCompletedTxn(verifyRes.transaction);
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch (err) {}

      if (onPaymentSuccess) {
        onPaymentSuccess(verifyRes.transaction);
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {completedTxn ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                {language === 'hi' ? 'भुगतान सफल!' : 'Payment Verified'}
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                ₹{completedTxn.amount.toLocaleString('en-IN')} Paid
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Invoice: <b className="text-slate-800">{completedTxn.invoice_number}</b> • Txn ID: {completedTxn.transaction_id}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-left text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Plan:</span>
                <span className="font-bold text-slate-800">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Post Limit:</span>
                <span className="font-bold text-emerald-700">{plan.job_post_limit} Job Posts Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Validity:</span>
                <span className="font-bold text-slate-800">{plan.duration_days} Days</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col space-y-2">
              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/employer/post-job';
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition text-sm shadow-md"
              >
                {language === 'hi' ? 'नौकरी पोस्ट करना शुरू करें' : 'Post Your Job Now'}
              </button>
              <button
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                {language === 'hi' ? 'बंद करें' : 'Close Receipt'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'hi' ? 'सुरक्षित 256-बिट भुगतान' : 'Secure Razorpay / UPI Gateway'}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                {language === 'hi' ? 'रिक्रूटर प्लान चुनें' : 'Upgrade Hiring Plan'}
              </h2>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-slate-900">
                  ₹{plan.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / {plan.duration_days} {language === 'hi' ? 'दिन की वैधता' : 'days validity'}
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center space-y-1 ${
                  paymentMethod === 'upi'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-xs">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center space-y-1 ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Cards / EMI</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center space-y-1 ${
                  paymentMethod === 'netbanking'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-xs">NetBanking</span>
              </button>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              {paymentMethod === 'upi' && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    {language === 'hi' ? 'UPI आईडी दर्ज करें (GPay / PhonePe / Paytm)' : 'Enter UPI ID (Google Pay, PhonePe, Paytm)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="mobile@upi or name@okaxis"
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Fast UPI</span>
                    <span>Direct instant authorization & invoice</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {language === 'hi' ? 'कार्ड नंबर' : 'Card Number'}
                    </label>
                    <input
                      type="text"
                      autoComplete="cc-number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      defaultValue="12/28"
                      className="px-3 py-2 text-sm bg-white rounded-lg border border-slate-300 outline-hidden"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="CVV"
                      defaultValue="786"
                      maxLength={4}
                      className="px-3 py-2 text-sm bg-white rounded-lg border border-slate-300 outline-hidden"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Select Indian Bank
                  </label>
                  <select className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-slate-300 outline-hidden">
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Punjab National Bank (PNB)</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}

              {/* Plan Benefits review */}
              <div className="py-2">
                <p className="text-xs font-semibold text-slate-600 mb-1.5">
                  {language === 'hi' ? 'प्लान की विशेषताएं:' : 'Included in this plan:'}
                </p>
                <div className="space-y-1">
                  {plan.features?.map((feat, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-700 space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg flex items-center justify-center space-x-2 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{language === 'hi' ? 'प्रक्रिया चल रही है...' : 'Authorizing Payment...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        {language === 'hi'
                          ? `₹${plan.price.toLocaleString('en-IN')} का सुरक्षित भुगतान करें`
                          : `Pay ₹${plan.price.toLocaleString('en-IN')} Securely`}
                      </span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-400">
                100% Secure Checkout with GST Invoice & Instant Plan Activation
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
