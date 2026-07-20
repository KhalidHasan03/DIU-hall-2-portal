import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ManagerExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: 'food', description: '', amount: '', expense_date: new Date().toISOString().split('T')[0] });

  const fetchExpenses = () => {
    setLoading(true);
    api.get('/manager/expenses').then(({ data }) => setExpenses(data.data || data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/manager/expenses', { ...form, amount: parseFloat(form.amount) });
      toast.success('Expense recorded');
      setShowForm(false);
      setForm({ category: 'food', description: '', amount: '', expense_date: new Date().toISOString().split('T')[0] });
      fetchExpenses();
    } catch { toast.error('Failed to save expense'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await api.delete(`/manager/expenses/${id}`);
      toast.success('Deleted');
      fetchExpenses();
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  const totalExpenses = expenses.reduce((s: number, e: any) => s + Number(e.amount), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Expenses</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Shopping & Expenses</h1>
          <p className="text-white/70 text-xs md:text-sm mt-1">Track all food purchases and hall expenses.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500">Total Expenses</p>
          <p className="text-xl font-bold text-rose-600">৳{totalExpenses.toLocaleString()}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-rose-200 hover:shadow-xl transition-all">
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none">
                <option value="food">Food Shopping</option>
                <option value="utilities">Utilities</option>
                <option value="maintenance">Maintenance</option>
                <option value="staff">Staff</option>
                <option value="furniture">Furniture</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Amount (BDT)</label>
              <input type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
              <input type="date" value={form.expense_date} onChange={e => setForm({...form, expense_date: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none" />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
              <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none" placeholder="What was purchased?" required />
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl text-sm font-medium shadow-md">Save Expense</button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 text-sm md:text-base">All Expenses</h2>
        </div>
        {expenses.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-3">💸</span>
            <p className="text-slate-400 font-medium">No expenses recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Description</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e: any) => (
                  <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{new Date(e.expense_date).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-4 py-3.5"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 capitalize">{e.category}</span></td>
                    <td className="px-4 py-3.5 text-slate-700 max-w-[200px] truncate">{e.description}</td>
                    <td className="px-4 py-3.5 text-right font-medium text-rose-600">৳{e.amount}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button onClick={() => handleDelete(e.id)} className="text-red-400 hover:text-red-600 text-xs font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}