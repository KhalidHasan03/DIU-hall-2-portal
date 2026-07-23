import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function StudentPaymentsPage() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/student/wallet'),
      api.get('/student/wallet/history'),
    ]).then(([wallet, txns]) => {
      setWalletBalance(wallet.data.balance ?? 0);
      const txnList = (Array.isArray(txns.data) ? txns.data : txns.data.data || []).map((t: any) => ({
        ...t,
        _date: t.created_at,
        _label: t.description || (t.type === 'credit' ? 'Wallet Top-Up' : 'Meal Deduction'),
        _amount: t.type === 'credit' ? t.amount : -Math.abs(t.amount),
      }));
      setTransactions(txnList);
    }).finally(() => setLoading(false));
  }, []);

  const totalSpentOnMeals = transactions
    .filter((t: any) => t.type === 'debit')
    .reduce((s: number, t: any) => s + Number(t.amount), 0);

  const totalDeposited = transactions
    .filter((t: any) => t.type === 'credit')
    .reduce((s: number, t: any) => s + Number(t.amount), 0);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Payments & Wallet</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Financial Overview</h1>
          <p className="text-white/70 text-xs md:text-sm mt-1">Your wallet is your meal fund — all money flows through it.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="relative overflow-hidden rounded-2xl p-4 md:p-5 text-white bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
          <p className="text-[10px] md:text-xs text-white/80 font-medium uppercase tracking-wider">Wallet Balance</p>
          <p className="text-xl md:text-2xl font-bold mt-1">৳{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] md:text-xs text-white/60 mt-0.5">Available for meals & bills</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-4 md:p-5 text-white bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <p className="text-[10px] md:text-xs text-white/80 font-medium uppercase tracking-wider">Total Deposited</p>
          <p className="text-xl md:text-2xl font-bold mt-1">৳{totalDeposited.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] md:text-xs text-white/60 mt-0.5">All wallet top-ups</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-4 md:p-5 text-white bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
          <p className="text-[10px] md:text-xs text-white/80 font-medium uppercase tracking-wider">Spent on Meals</p>
          <p className="text-xl md:text-2xl font-bold mt-1">৳{totalSpentOnMeals.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] md:text-xs text-white/60 mt-0.5">Auto-deducted from wallet</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
        <h2 className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-2 mb-4">
          <span className="w-1 h-5 bg-blue-500 rounded-full inline-block" />
          Wallet Transactions
        </h2>

        {transactions.length === 0 ? (
          <div className="text-center py-10">
            <span className="text-4xl block mb-3">💳</span>
            <p className="text-slate-400 font-medium">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((item: any) => (
              <div key={item.id}
                className="group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-slate-50 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all border border-slate-100 hover:border-indigo-200">
                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-base md:text-lg shrink-0 ${
                  item.type === 'credit' ? 'bg-emerald-100' : 'bg-red-100'
                }`}>
                  {item.type === 'credit' ? '💰' : '🍽️'}
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
                  <p className={`text-sm md:text-base font-bold ${item.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {item.type === 'credit' ? '+' : '-'}
                    ৳{Number(Math.abs(item.amount)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  {item.balance_after !== undefined && (
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
            <h3 className="text-sm md:text-base font-semibold text-slate-800">How It Works</h3>
            <ul className="text-xs md:text-sm text-slate-600 mt-2 space-y-1.5 list-disc list-inside">
              <li><strong>Wallet Top-Ups</strong> — Manager adds money to your wallet (cash, bKash, etc.)</li>
              <li><strong>Meal Deductions</strong> — Meal costs auto-deduct from your wallet when attendance is marked</li>
              <li><strong>Bill Settlement</strong> — Monthly bills are covered by your wallet balance automatically</li>
              <li>Top up your wallet regularly to keep your balance positive</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
