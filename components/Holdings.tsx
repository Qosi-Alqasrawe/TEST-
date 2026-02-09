import React, { useState } from 'react';
import { HoldingState, TransactionType } from '../types';
import { RefreshCw, Edit2, Check, X, TrendingUp, TrendingDown } from 'lucide-react';
import Button from './ui/Button';

interface HoldingsProps {
  holdings: HoldingState[];
  onRefreshPrices: () => void;
  onUpdatePrice: (ticker: string, price: number) => void;
  onTrade: (ticker: string, type: TransactionType) => void;
  isLoadingPrices: boolean;
}

const Holdings: React.FC<HoldingsProps> = ({ holdings, onRefreshPrices, onUpdatePrice, onTrade, isLoadingPrices }) => {
  const [editingTicker, setEditingTicker] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<string>('');

  const startEditing = (ticker: string, currentPrice: number) => {
    setEditingTicker(ticker);
    setEditPriceVal(currentPrice.toString());
  };

  const cancelEditing = () => {
    setEditingTicker(null);
    setEditPriceVal('');
  };

  const savePrice = (ticker: string) => {
    const newPrice = parseFloat(editPriceVal);
    if (!isNaN(newPrice) && newPrice >= 0) {
      onUpdatePrice(ticker, newPrice);
    }
    setEditingTicker(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Holdings</h1>
          <p className="text-slate-400 mt-1">Your active positions</p>
        </div>
        <Button variant="secondary" onClick={onRefreshPrices} disabled={isLoadingPrices}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingPrices ? 'animate-spin' : ''}`} />
          {isLoadingPrices ? 'Refreshing...' : 'Refresh Prices'}
        </Button>
      </div>

      <div className="bg-slate-850 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
              <tr>
                <th className="px-6 py-3">Ticker</th>
                <th className="px-6 py-3 text-right">Shares</th>
                <th className="px-6 py-3 text-right">Avg Cost</th>
                <th className="px-6 py-3 text-right">Price</th>
                <th className="px-6 py-3 text-right">Mkt Value</th>
                <th className="px-6 py-3 text-right">Unrealized P/L</th>
                <th className="px-6 py-3 text-right">Alloc %</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holdings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    No open positions. Add a transaction to get started.
                  </td>
                </tr>
              ) : (
                holdings.map((h) => {
                  const isProfit = h.unrealizedPL >= 0;
                  const isEditing = editingTicker === h.ticker;

                  return (
                    <tr key={h.ticker} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="px-6 py-4 font-bold text-slate-100">{h.ticker}</td>
                      <td className="px-6 py-4 text-right">{h.shares.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                      <td className="px-6 py-4 text-right text-slate-400">${h.avgCost.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-medium text-brand-400">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-2">
                             <input 
                               type="number" 
                               value={editPriceVal}
                               onChange={(e) => setEditPriceVal(e.target.value)}
                               className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-sm focus:border-brand-500 outline-none"
                               autoFocus
                             />
                             <button onClick={() => savePrice(h.ticker)} className="text-green-400 hover:text-green-300"><Check size={16} /></button>
                             <button onClick={cancelEditing} className="text-red-400 hover:text-red-300"><X size={16} /></button>
                          </div>
                        ) : (
                          <div className="group flex items-center justify-end gap-2 cursor-pointer" onClick={() => startEditing(h.ticker, h.currentPrice)}>
                            <span>${h.currentPrice.toFixed(2)}</span>
                            <Edit2 size={12} className="opacity-0 group-hover:opacity-50 text-slate-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-100">${h.marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className={`px-6 py-4 text-right font-medium ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                        <div className="flex flex-col items-end">
                          <span>{isProfit ? '+' : ''}{h.unrealizedPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span className="text-xs opacity-70">({isProfit ? '+' : ''}{h.unrealizedPLPercent.toFixed(2)}%)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-400">{h.allocationPercent.toFixed(1)}%</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => onTrade(h.ticker, TransactionType.BUY)}
                            className="p-1.5 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                            title="Buy More"
                          >
                            <TrendingUp size={16} />
                          </button>
                          <button 
                            onClick={() => onTrade(h.ticker, TransactionType.SELL)}
                            className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Sell"
                          >
                            <TrendingDown size={16} />
                          </button>
                        </div>
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

export default Holdings;