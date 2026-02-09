import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import Button from './ui/Button';
import { Plus, Trash2, Search } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  onOpenModal: () => void;
  onDeleteTransaction: (id: string) => void;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, onOpenModal, onDeleteTransaction }) => {
  const [filter, setFilter] = useState('');

  const filteredTransactions = transactions
    .filter(t => t.ticker.includes(filter.toUpperCase()) || t.type.includes(filter.toUpperCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Transactions</h1>
          <p className="text-slate-400 mt-1">Record your buys and sells</p>
        </div>
        <Button onClick={onOpenModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Table Section */}
      <div className="bg-slate-850 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search ticker..." 
              className="bg-slate-900 border border-slate-700 text-slate-100 text-sm rounded-lg pl-10 p-2.5 w-full focus:ring-brand-500 focus:border-brand-500"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Ticker</th>
                <th className="px-6 py-3 text-right">Qty</th>
                <th className="px-6 py-3 text-right">Price</th>
                <th className="px-6 py-3 text-right">Fees</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                 <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    No transactions found. Add one to get started.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => {
                  const total = (tx.price * tx.quantity) + (tx.type === 'BUY' ? tx.fees : -tx.fees);
                  return (
                    <tr key={tx.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="px-6 py-4 font-medium whitespace-nowrap">{tx.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          tx.type === 'BUY' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-100">{tx.ticker}</td>
                      <td className="px-6 py-4 text-right">{tx.quantity.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">${tx.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right text-slate-500">${tx.fees.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-medium">${Math.abs(total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => onDeleteTransaction(tx.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;