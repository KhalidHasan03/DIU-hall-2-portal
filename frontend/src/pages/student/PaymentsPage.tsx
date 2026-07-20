import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function StudentPaymentsPage() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [billPayments, setBillPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'wallet' | 'bills'>('all');

  useEffect(() => {
    Promise.all([
      api.get('/student/wallet'),
      api.get('/student/wallet/history'),
      api.get('/student/payments/history'),
    ]).then(([wallet, txns, pays]) => {
      setWalletBalance(wallet.data.balance ?? 0);
      const txnList = (txns.data.data || txns.data || []).map((t: any) => ({
        ...t,
        _type: 'wallet' as const,
        _date: t.created_at,
        _label: t.type === 'credit' ? 'Wallet Top-Up' : 'Meal Deduction',
        _amount: t.type === 'credit' ? t.amount : -Math.abs(t.amount),
        _method: t.type === 'credit' ? 'advance' : 'meal',
      }));
      const payList = (Array.isArray(pays.data) ? pays.data : []).map((p: any) => ({
        ...p,
        _type: 'bill' as const,
        _date: p.paid_at,
        _label: 'Bill Payment',
        _amount: p.amount,
        _method: p.payment_method,
      }));
      setTransactions(txnList);
      setBillPayments(payList);
    }).finally(() => setLoading(false));
  }, []);

  const allItems = [...transactions, ...billPayments]
    .sort((a, b) => new Date(b._date).getTime() - new Date(a._date).getTime());

  const filteredItems = filter === 'all' ? allItems
    : filter === 'wallet' ? transactions
    : billPayments;

  const totalSpentOnMeals = transactions
    .filter((t: any) => t.type === 'debit')
    .reduce((s: number, t: any) => s + Number(t.amount), 0);

  const totalDeposited = transactions
    .filter((t: any) => t.type === 'credit')
    .reduce((s: number, t: any) => s + Number(t.amount), 0);

  const totalBillsPaid = billPayments.reduce((s: number, p: any) => s + Number(p.amount), 0);

  const methodIcons: Record<string, string> = {
    cash: '💵', bank_transfer: '🏦', mobile_bkash: '📱', nagad: '📱', other: '💳',
    advance: '💰', meal: '🍽️',
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Payments & Wallet</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Financial Overview</h1>
          <p className="text-white/70 text-xs md:text-sm mt-1">Track your wallet, meal costs, and bill payments in one place.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="relative overflow-hidden rounded-2xl p-4 md:p-5 text-white bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
          <p className="text-[10px] md:text-xs text-white/80 font-medium uppercase tracking-wider">Wallet Balance</p>
          <p className="text-xl md:text-2xl font-bold mt-1">৳{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] md:text-xs text-white/60 mt-0.5">Available for meals</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-4 md:p-5 text-white bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <p className="text-[10px] md:text-xs text-white/80 font-medium uppercase tracking-wider">Total Deposited</p>
          <p className="text-xl md:text-2xl font-bold mt-1">৳{totalDeposited.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] md:text-xs text-white/60 mt-0.5">Wallet top-ups</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-4 md:p-5 text-white bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
          <p className="text-[10px] md:text-xs text-white/80 font-medium uppercase tracking-wider">Spent on Meals</p>
          <p className="text-xl md:text-2xl font-bold mt-1">৳{totalSpentOnMeals.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] md:text-xs text-white/60 mt-0.5">Auto-deducted</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-4 md:p-5 text-white bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
          <p className="text-[10px] md:text-xs text-white/80 font-medium uppercase tracking-wider">Bills Paid</p>
          <p className="text-xl md:text-2xl font-bold mt-1">৳{totalBillsPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] md:text-xs text-white/60 mt-0.5">Via hall office</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-500 rounded-full inline-block" />
            All Transactions
          </h2>
          <div className="flex gap-1">
            {(['all', 'wallet', 'bills'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === f ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                {f === 'all' ? 'All' : f === 'wallet' ? 'Wallet' : 'Bill Payments'}
              </button>
            ))}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-10">
            <span className="text-4xl block mb-3">💳</span>
            <p className="text-slate-400 font-medium">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item: any) => (
              <div key={item.id || item._type + Math.random()}
                className="group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-slate-50 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all border border-slate-100 hover:border-indigo-200">
                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-base md:text-lg shrink-0 ${
                  item._type === 'wallet' && item.type === 'credit' ? 'bg-emerald-100' :
                  item._type === 'wallet' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {item._type === 'wallet' && item.type === 'credit' ? '💰' :
                   item._type === 'wallet' ? '🍽️' :
                   methodIcons[item.payment_method] || '💳'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-semibold text-slate-800">{item._label}</p>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">
                    {item.description && <span className="mr-1">{item.description} · </span>}
                    {new Date(item._date).toLocaleDateString('en-BD', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className={`text-sm md:text-base font-bold ${
                    item._type === 'wallet' && item.type === 'credit' ? 'text-emerald-600' :
                    item._type === 'wallet' ? 'text-red-500' : 'text-blue-600'
                  }`}>
                    {item._type === 'wallet' && item.type === 'credit' ? '+' : ''}
                    {item._type === 'wallet' && item.type === 'debit' ? '-' : ''}
                    ৳{Number(Math.abs(item._amount)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  {item._type === 'wallet' && item.balance_after !== undefined && (
                    <p className="text-[10px] text-slate-400 mt-0.5">Bal: ৳{Number(item.balance_after).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-4 md:p-6 border border-cyan-200">
        <div className="flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div>
            <h3 className="text-sm md:text-base font-semibold text-slate-800">How Payments Work</h3>
            <ul className="text-xs md:text-sm text-slate-600 mt-2 space-y-1.5 list-disc list-inside">
              <li><strong>Wallet Top-Ups</strong> — Manager adds advance payments to your wallet</li>
              <li><strong>Meal Deductions</strong> — Lunch (50) & Dinner (60) auto-deducted when you attend</li>
              <li><strong>Bill Payments</strong> — Monthly bill payments recorded by the manager</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
