import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/student/wallet'),
      api.get('/student/wallet/history'),
    ]).then(([bal, txns]) => {
      setBalance(bal.data.balance ?? 0);
      setTransactions(txns.data.data ?? txns.data ?? []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Wallet</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Your Prepaid Wallet</h1>
          <p className="text-white/70 text-xs md:text-sm mt-1">Manage your meal funds and track transactions.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 text-center">
        <p className="text-xs md:text-sm text-slate-500 font-medium uppercase tracking-wider">Current Balance</p>
        <p className={`text-3xl md:text-5xl font-bold mt-2 ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          ৳{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-slate-400 mt-2">Meal costs are auto-deducted when attendance is marked</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-2">
            <span className="w-1 h-5 bg-emerald-500 rounded-full inline-block" />
            Transaction History
          </h2>
        </div>
        {transactions.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-3">💳</span>
            <p className="text-slate-400 font-medium">No transactions yet</p>
            <p className="text-xs text-slate-300 mt-1">Advance payments and meal deductions will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {transactions.map((txn: any) => (
              <div key={txn.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-5 hover:bg-slate-50/50 transition-colors">
                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-base md:text-lg shrink-0 ${
                  txn.type === 'credit'
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {txn.type === 'credit' ? '💰' : '🍽️'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-medium text-slate-800 capitalize">
                    {txn.type === 'credit' ? 'Advance Payment' : 'Meal Deduction'}
                  </p>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">
                    {txn.description && <span className="mr-1">{txn.description} · </span>}
                    {new Date(txn.created_at).toLocaleDateString('en-BD', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className={`text-sm md:text-base font-bold ${txn.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {txn.type === 'credit' ? '+' : '-'} ৳{Number(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">
                    Balance: ৳{Number(txn.balance_after).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 md:p-6 border border-emerald-200">
        <div className="flex items-start gap-3 md:gap-4">
          <span className="text-xl md:text-2xl">ℹ️</span>
          <div>
            <h3 className="text-sm md:text-base font-semibold text-slate-800">How It Works</h3>
            <ul className="text-xs md:text-sm text-slate-600 mt-2 space-y-1.5 list-disc list-inside">
              <li>Manager adds advance payments to your wallet</li>
              <li>Each meal you attend costs ৳50 (lunch) or ৳60 (dinner)</li>
              <li>Cost is auto-deducted when the manager marks your attendance</li>
              <li>Check your balance regularly to avoid running low</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
