import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, HoldingState, PortfolioMetrics, TransactionType } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Holdings from './components/Holdings';
import TransactionModal from './components/TransactionModal';
import { loadTransactions, saveTransactions, loadPrices, savePrices } from './services/storage';
import { calculatePortfolioState } from './services/engine';
import { fetchCurrentPrices } from './services/marketData';

const App = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'holdings'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialTicker, setModalInitialTicker] = useState('');
  const [modalInitialType, setModalInitialType] = useState<TransactionType>(TransactionType.BUY);

  // Load data on mount
  useEffect(() => {
    const loadedTx = loadTransactions();
    const loadedPrices = loadPrices();
    setTransactions(loadedTx);
    setPrices(loadedPrices);
    setIsDataLoaded(true);
  }, []);

  // Persist transactions when changed
  useEffect(() => {
    if (isDataLoaded) {
        saveTransactions(transactions);
    }
  }, [transactions, isDataLoaded]);

  // Derived state
  const { holdings, metrics, closedPositions } = useMemo(() => {
    return calculatePortfolioState(transactions, prices);
  }, [transactions, prices]);

  // Actions
  const handleAddTransaction = (txData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...txData,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    setTransactions(prev => [...prev, newTx]);
    
    // Auto-update price if not set
    if (!prices[newTx.ticker]) {
        handleRefreshPrices([newTx.ticker]);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleRefreshPrices = async (specificTickers?: string[]) => {
    setIsLoadingPrices(true);
    const tickersToFetch = specificTickers || Array.from(new Set(transactions.map(t => t.ticker)));
    
    try {
      const newPrices = await fetchCurrentPrices(tickersToFetch);
      setPrices(prev => {
        const updated = { ...prev, ...newPrices };
        savePrices(updated);
        return updated;
      });
    } catch (error) {
      console.error("Failed to fetch prices", error);
    } finally {
      setIsLoadingPrices(false);
    }
  };

  const handleUpdatePrice = (ticker: string, newPrice: number) => {
    setPrices(prev => {
      const updated = { ...prev, [ticker]: newPrice };
      savePrices(updated);
      return updated;
    });
  };

  // Modal Triggers
  const openModal = (ticker: string = '', type: TransactionType = TransactionType.BUY) => {
    setModalInitialTicker(ticker);
    setModalInitialType(type);
    setIsModalOpen(true);
  };

  return (
    <>
        <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'dashboard' && (
            <Dashboard 
            metrics={metrics} 
            holdings={holdings} 
            closedPositions={closedPositions}
            onAddTransaction={() => openModal()}
            />
        )}
        {activeTab === 'transactions' && (
            <Transactions 
            transactions={transactions} 
            onOpenModal={() => openModal()}
            onDeleteTransaction={handleDeleteTransaction}
            />
        )}
        {activeTab === 'holdings' && (
            <Holdings 
            holdings={holdings} 
            onRefreshPrices={() => handleRefreshPrices()}
            onUpdatePrice={handleUpdatePrice}
            onTrade={(ticker, type) => openModal(ticker, type)}
            isLoadingPrices={isLoadingPrices}
            />
        )}
        </Layout>

        <TransactionModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddTransaction}
            holdings={holdings}
            initialTicker={modalInitialTicker}
            initialType={modalInitialType}
        />
    </>
  );
};

export default App;