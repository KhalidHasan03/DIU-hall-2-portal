import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ManagerPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [pendingBills, setPendingBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAdvanceForm, setShowAdvanceForm] = useState(false);
  const [form, setForm] = useState({ student_id: '', amount: '', payment_method: 'cash', paid_at: new Date().toISOString().split('T')[0], notes: '' });
  const [advanceForm, setAdvanceForm] = useState({ student_id: '', amount: '', payment_method: 'cash', paid_at: new Date().toISOString().split('T')[0], notes: '' });

  useEffect(() => {
    Promise.all([
      api.get('/manager/payments'),
      api.get('/manager/students'),
      api.get('/manager/bills/pending'),
    ]).then(([p, s, b]) => {
      setPayments(p.data.data || p.data);
      setStudents(s.data.data || s.data);
      setPendingBills(b.data.data || b.data || []);
    }).catch(() => {
      toast.error('Failed to load data');
    }).finally(() => setLoading(false));
  }, []);

  const currentBill = form.student_id
    ? pendingBills.find((b: any) => (b.student_id === parseInt(form.student_id) || b.student?.id === parseInt(form.student_id)) && b.month === new Date().toISOString().slice(0, 7))
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBill) {
      toast.error('No pending bill found for this student this month');
      return;
    }
    try {
      await api.post('/manager/payments/record', { ...form, amount: parseFloat(form.amount), monthly_bill_id: currentBill.id });
      toast.success('Payment recorded!');
      setShowForm(false);
      setForm({ student_id: '', amount: '', payment_method: 'cash', paid_at: new Date().toISOString().split('T')[0], notes: '' });
      const [p, b] = await Promise.all([api.get('/manager/payments'), api.get('/manager/bills/pending')]);
      setPayments(p.data.data || p.data);
      setPendingBills(b.data.data || b.data || []);
    } catch { toast.error('Failed to record payment'); }
  };

  const handleAdvanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/manager/payments/advance', { ...advanceForm, amount: parseFloat(advanceForm.amount) });
      toast.success('Advance payment recorded! Wallet credited.');
      setShowAdvanceForm(false);
      setAdvanceForm({ student_id: '', amount: '', payment_method: 'cash', paid_at: new Date().toISOString().split('T')[0], notes: '' });
    } catch { toast.error('Failed to record advance payment'); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  const totalCollected = payments.reduce((s: number, p: any) => s + Number(p.amount), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Collections</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Student Payments</h1>
          <p className="text-white/70 text-xs md:text-sm mt-1">Record and track money collected from students.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500">Total Collected</p>
          <p className="text-xl font-bold text-emerald-600">৳{totalCollected.toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowAdvanceForm(!showAdvanceForm); setShowForm(false); }} className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-200 hover:shadow-xl transition-all">
            {showAdvanceForm ? 'Cancel' : '+ Advance Wallet'}
          </button>
          <button onClick={() => { setShowForm(!showForm); setShowAdvanceForm(false); }} className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-emerald-200 hover:shadow-xl transition-all">
            {showForm ? 'Cancel' : '+ Record Payment'}
          </button>
        </div>
      </div>

      {showAdvanceForm && (
        <form onSubmit={handleAdvanceSubmit} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-500 rounded-full inline-block" />
            Advance Wallet Payment
          </h3>
          <p className="text-xs text-slate-500">Instantly credits the student's prepaid wallet for meal auto-deduction.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Student</label>
              <select value={advanceForm.student_id} onChange={e => setAdvanceForm({...advanceForm, student_id: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" required>
                <option value="">Select student</option>
                {students.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.user?.name} (Floor: {s.room_number})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Amount (BDT)</label>
              <input type="number" step="0.01" min="1" value={advanceForm.amount} onChange={e => setAdvanceForm({...advanceForm, amount: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Method</label>
              <select value={advanceForm.payment_method} onChange={e => setAdvanceForm({...advanceForm, payment_method: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                <option value="cash">Cash</option>
                <option value="mobile_bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
              <input type="date" value={advanceForm.paid_at} onChange={e => setAdvanceForm({...advanceForm, paid_at: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes (optional)</label>
            <input type="text" value={advanceForm.notes} onChange={e => setAdvanceForm({...advanceForm, notes: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="Any reference or remarks" />
          </div>
          <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-md">Credit Wallet</button>
        </form>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Student</label>
              <select value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" required>
                <option value="">Select student</option>
                {students.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.user?.name} (Floor: {s.room_number})</option>
                ))}
              </select>
              {form.student_id && !currentBill && (
                <p className="text-xs text-amber-600 mt-1">No pending bill for this month</p>
              )}
              {currentBill && (
                <p className="text-xs text-emerald-600 mt-1">Bill: {currentBill.month} — ৳{currentBill.total_amount} ({currentBill.status})</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Amount (BDT)</label>
              <input type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Method</label>
              <select value={form.payment_method} onChange={e => setForm({...form, payment_method: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
                <option value="cash">Cash</option>
                <option value="mobile_bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
              <input type="date" value={form.paid_at} onChange={e => setForm({...form, paid_at: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes (optional)</label>
            <input type="text" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="Any reference or remarks" />
          </div>
          <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-medium shadow-md">Record Payment</button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 text-sm md:text-base">Payment History</h2>
        </div>
        {payments.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-3">💳</span>
            <p className="text-slate-400 font-medium">No payments recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Student</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Floor</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Method</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p: any) => (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-slate-700 font-medium">{p.student?.user?.name || 'Unknown'}</td>
                    <td className="px-4 py-3.5 text-slate-500">{p.student?.room_number || '-'}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-emerald-600">+ ৳{p.amount}</td>
                    <td className="px-4 py-3.5"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 capitalize">{p.payment_method?.replace('_', ' ')}</span></td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{new Date(p.paid_at).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
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