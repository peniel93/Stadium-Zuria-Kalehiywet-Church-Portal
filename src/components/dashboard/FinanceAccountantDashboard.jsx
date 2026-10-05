import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import { DollarSign, FileText, Send, Download, Printer, PlusCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const FinanceAccountantDashboard = ({ roleTitle = "Accountant & Astedader Financial Dashboard" }) => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('ledger'); // 'ledger', 'add_record'

  const ledger = db?.financial_records || [
    { id: '1', type: 'Income', amount: 45000.00, category: 'Night Chapel Collection', date: '2026-07-25 20:00', reason: 'Friday Night Chapel Tithes', spent_by: 'Genzeb Yazh Committee' },
    { id: '2', type: 'Expense', amount: 8500.00, category: 'Utilities', date: '2026-07-26 11:30', reason: 'Monthly Electricity Settlement', spent_by: 'Astedader Office' }
  ];

  const [recordForm, setRecordForm] = useState({
    type: 'Expense',
    amount: 1500.00,
    category: 'Church Maintenance',
    reason: 'Audio Cable Repair & Replacement',
    spent_by: 'Sound Technician',
    date: '2026-07-27 10:00'
  });

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!recordForm.amount || !recordForm.reason) {
      showToast("Amount and Reason are required", "error");
      return;
    }

    const freshDb = getMockDB();
    if (!freshDb.financial_records) freshDb.financial_records = [];

    const newRec = {
      id: `fin-${Date.now()}`,
      type: recordForm.type,
      record_type: recordForm.type,
      amount: parseFloat(recordForm.amount),
      category: recordForm.category,
      date: recordForm.date || new Date().toISOString().slice(0, 16).replace('T', ' '),
      transaction_date_time: recordForm.date || new Date().toISOString(),
      reason: recordForm.reason,
      reason_description: recordForm.reason,
      spent_by: recordForm.spent_by,
      spent_by_or_received_from: recordForm.spent_by,
      created_at: new Date().toISOString()
    };

    freshDb.financial_records.unshift(newRec);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Financial record (${recordForm.type}: ${recordForm.amount} ETB) saved to Database!`, "success");
    setActiveTab('ledger');
  };

  const handleExportCSV = () => {
    let csv = "Type,Amount (ETB),Category,Date & Time,Reason Description,Spent By / Received From\n";
    ledger.forEach(r => {
      csv += `"${r.type}",${r.amount},"${r.category}","${r.date}","${r.reason}","${r.spent_by}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Financial_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast("Exported financial records to CSV!", "success");
  };

  const totalIncome = ledger.filter(r => r.type === 'Income').reduce((acc, r) => acc + r.amount, 0);
  const totalExpense = ledger.filter(r => r.type === 'Expense').reduce((acc, r) => acc + r.amount, 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Financial Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #166534' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 700 }}>
            <ArrowDownLeft size={20} />
            <span>Total Income Recorded</span>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{totalIncome.toLocaleString()} ETB</h3>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontWeight: 700 }}>
            <ArrowUpRight size={20} />
            <span>Total Expenses Recorded</span>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{totalExpense.toLocaleString()} ETB</h3>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--primary-blue)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-blue)', fontWeight: 700 }}>
            <DollarSign size={20} />
            <span>Net Financial Balance</span>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{netBalance.toLocaleString()} ETB</h3>
        </div>
      </div>

      {/* Top Header & Tabs */}
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            {roleTitle}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Daily financial ledger, expense reasons, date & time logging, Genzeb Yazh reporting, and CSV/PDF/Print exporter.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`btn ${activeTab === 'ledger' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FileText size={16} />
            <span>View Financial Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('add_record')}
            className={`btn ${activeTab === 'add_record' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <PlusCircle size={16} />
            <span>Record New Expense / Income</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Financial Ledger Table */}
      {activeTab === 'ledger' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Financial Ledger</h3>
            <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
                <Download size={14} />
                <span>Export CSV</span>
              </button>
              <button onClick={() => window.print()} className="btn btn-primary btn-sm">
                <Printer size={14} />
                <span>Print Ledger Report</span>
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount (ETB)</th>
                  <th>Category</th>
                  <th>Date & Time</th>
                  <th>Reason Description</th>
                  <th>Spent By / Received From</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map(r => (
                  <tr key={r.id}>
                    <td>
                      <span className={`badge ${r.type === 'Income' ? 'badge-success' : 'badge-danger'}`}>
                        {r.type}
                      </span>
                    </td>
                    <td><strong style={{ fontSize: '1rem', color: r.type === 'Income' ? '#166534' : '#dc2626' }}>{r.amount.toLocaleString()} ETB</strong></td>
                    <td>{r.category}</td>
                    <td>{r.date}</td>
                    <td>{r.reason}</td>
                    <td>{r.spent_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Record New Expense / Income */}
      {activeTab === 'add_record' && (
        <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            Record Expense or Income
          </h3>

          <form onSubmit={handleAddRecord}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Transaction Type</label>
                <select
                  className="form-control"
                  value={recordForm.type}
                  onChange={e => setRecordForm({ ...recordForm, type: e.target.value })}
                >
                  <option value="Expense">Expense (ወጪ)</option>
                  <option value="Income">Income (ገቢ)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Amount (ETB) *</label>
                <input
                  type="number"
                  required
                  className="form-control"
                  value={recordForm.amount}
                  onChange={e => setRecordForm({ ...recordForm, amount: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Utilities, Salaries, Maintenance, Night Chapel"
                value={recordForm.category}
                onChange={e => setRecordForm({ ...recordForm, category: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Reason for Expense / Income *</label>
              <textarea
                rows={3}
                required
                className="form-control"
                placeholder="Detail how the money was spent or received..."
                value={recordForm.reason}
                onChange={e => setRecordForm({ ...recordForm, reason: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Spent By / Received From</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Astedader Office / Genzeb Yazh"
                value={recordForm.spent_by}
                onChange={e => setRecordForm({ ...recordForm, spent_by: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <Send size={16} />
              <span>Save Record & Send Financial Report</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
