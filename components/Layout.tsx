import React from 'react';
import { LayoutDashboard, Receipt, LineChart, Wallet } from 'lucide-react';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'transactions' | 'holdings';
  onTabChange: (tab: 'dashboard' | 'transactions' | 'holdings') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'holdings', label: 'Holdings', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-850 border-r border-slate-800 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <LineChart className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-brand-100">
            {APP_NAME}
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-600/10 text-brand-400 border border-brand-600/20 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-center">
            Stored locally. No data leaves your browser.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-slate-850 p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20">
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center">
                    <LineChart className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg">{APP_NAME}</span>
            </div>
            <div className="flex gap-2">
                {navItems.map((item) => (
                    <button 
                        key={item.id} 
                        onClick={() => onTabChange(item.id)}
                        className={`p-2 rounded ${activeTab === item.id ? 'bg-slate-700 text-brand-400' : 'text-slate-400'}`}
                    >
                        <item.icon size={20} />
                    </button>
                ))}
            </div>
        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;