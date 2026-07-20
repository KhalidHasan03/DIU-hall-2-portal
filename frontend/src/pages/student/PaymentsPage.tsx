import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function StudentPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/payments/history').then(({ data }) => {
      setPayments(Array.isArray(data) ? data : []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Payments</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Payment History</h1>
          <p className="text-white/70 text-xs md:text-sm mt-1">Track all your payments and transactions.</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 md:p-16 text-center border border-dashed border-slate-200">
          <span className="text-4xl md:text-6xl block mb-3 md:mb-4">💳</span>
          <p className="text-sm md:text-lg text-slate-400 font-medium">No payments recorded yet</p>
          <p className="text-xs md:text-sm text-slate-300 mt-1">Your payment history will appear here once the manager records a payment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-sm md:text-base font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-500 rounded-full inline-block" />
              All Transactions
            </h2>
            <span className="text-xs md:text-sm text-slate-400">{payments.length} payment{payments.length > 1 ? 's' : ''}</span>
          </div>

          <div className="space-y-2 md:space-y-3">
            {payments.map((payment: any) => {
              const methodIcons: Record<string, string> = {
                cash: '💵', bank_transfer: '🏦', mobile_bkash: '📱', nagad: '📱', other: '💳',
              };
              return (
                <div key={payment.id} className="group relative flex items-center gap-3 md:gap-5 p-3 md:p-5 rounded-xl bg-slate-50 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-200 border border-slate-100 hover:border-indigo-200">
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-400/20 to-indigo-500/20 flex items-center justify-center text-base md:text-xl shrink-0">
                    {methodIcons[payment.payment_method] || '💳'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm md:text-base font-semibold text-slate-800 truncate">
                          {payment.payment_method === 'mobile_bkash' ? 'bKash' :
                           payment.payment_method === 'bank_transfer' ? 'Bank Transfer' :
                           payment.payment_method.charAt(0).toUpperCase() + payment.payment_method.slice(1)} Payment
                        </p>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">
                          {new Date(payment.paid_at).toLocaleDateString('en-BD', {
                            day: 'numeric', month: 'long', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="text-sm md:text-lg font-bold text-emerald-600">+ ৳{payment.amount}</p>
                        {payment.transaction_ref && (
                          <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">Ref: {payment.transaction_ref}</p>
                        )}
                      </div>
                    </div>
                    {payment.notes && (
                      <p className="text-[10px] md:text-xs text-slate-400 mt-2 italic border-t border-slate-200 pt-2">{payment.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-4 md:p-6 border border-cyan-200">
        <div className="flex items-start gap-3 md:gap-4">
          <span className="text-xl md:text-2xl">ℹ️</span>
          <div>
            <h3 className="text-sm md:text-base font-semibold text-slate-800">Payment Methods</h3>
            <p className="text-xs md:text-sm text-slate-600 mt-1">Payments are recorded by the hall manager. You can pay via Cash, bKash, Nagad, or Bank Transfer at the manager's office.</p>
          </div>
        </div>
      </div>
    </div>
  );
}