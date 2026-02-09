import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, HoldingState } from '../types';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { AlertCircle, X } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  holdings: HoldingState[];
  initialTicker?: string;
  initialType?: TransactionType;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  holdings, 
  initialTicker = '', 
  initialType = TransactionType.BUY 
}) => {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    ticker: initialTicker,
    type: initialType,
    quantity: '',
    price: '',
    fees: '0'
  });

  // Update form when props change
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        ticker: initialTicker,
        type: initialType
      }));
      setError(null);
    }
  }, [isOpen, initialTicker, initialType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.ticker || !formData.quantity || !formData.price) return;

    const quantity = Number(formData.quantity);
    const tickerUpper = formData.ticker.toUpperCase();

    // Validation: Check if selling more than held
    if (formData.type === TransactionType.SELL) {
        const holding = holdings.find(h => h.ticker === tickerUpper);
        const currentShares = holding ? holding.shares : 0;
        
        if (quantity > currentShares) {
            setError(`Cannot sell ${quantity} shares of ${tickerUpper}. You only hold ${currentShares}.`);
            return;
        }
    }

    onSubmit({
      date: formData.date,
      ticker: tickerUpper,
      type: formData.type,
      quantity: quantity,
      price: Number(formData.price),
      fees: Number(formData.fees),
      currency: 'USD'
    });
    
    // Reset form data partially but keep date
    setFormData(prev => ({
        ...prev,
        quantity: '',
        price: '',
        fees: '0'
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-850 w-full max-w-2xl rounded-xl border border-slate-800 shadow-2xl overflow-hidden relative">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
             <h3 className="text-xl font-bold text-slate-100">
                {formData.type === TransactionType.BUY ? 'Buy Stock' : 'Sell Stock'}
             </h3>
             <button onClick={onClose} className="text-slate-400 hover:text-white">
                <X size={24} />
             </button>
        </div>

        <div className="p-6">
            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                label="Date" 
                type="date" 
                required
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                />
                <Input 
                label="Ticker (Symbol)" 
                placeholder="e.g. AAPL" 
                required
                autoFocus={!initialTicker}
                value={formData.ticker}
                onChange={e => setFormData({...formData, ticker: e.target.value})}
                />
                <Select 
                label="Type" 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as TransactionType})}
                >
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
                </Select>
                <div className="hidden md:block"></div> {/* Spacer */}
                
                <Input 
                label="Quantity" 
                type="number" 
                step="any" 
                min="0"
                required
                placeholder="0.00"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
                />
                <Input 
                label="Price per Share" 
                type="number" 
                step="any" 
                min="0"
                required
                placeholder="0.00"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                />
                <Input 
                label="Fees (Total)" 
                type="number" 
                step="any" 
                min="0"
                placeholder="0.00"
                value={formData.fees}
                onChange={e => setFormData({...formData, fees: e.target.value})}
                />
                
                <div className="md:col-span-2 flex justify-end gap-3 mt-6">
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit">
                    {formData.type === TransactionType.BUY ? 'Confirm Buy' : 'Confirm Sell'}
                </Button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;