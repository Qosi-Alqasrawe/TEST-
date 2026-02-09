import React from 'react';
import { HoldingState, PortfolioMetrics } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Plus } from 'lucide-react';
import Button from './ui/Button';

interface DashboardProps {
  metrics: PortfolioMetrics;
  holdings: HoldingState[];
  closedPositions: HoldingState[];
  onAddTransaction: () => void;
}

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#f97316', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

const Dashboard: React.FC<DashboardProps> = ({ metrics, holdings, closedPositions, onAddTransaction }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const formatPercent = (val: number) => 
    `${val > 0 ? '+' : ''}${val.toFixed(2)}%`;

  const MetricCard = ({ title, value, subValue, icon: Icon, trend }: any) => (
    <div className="bg-slate-850 p-6 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon size={48} />
      </div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-100">{value}</h3>
      {subValue && (
        <p className={`text-sm mt-2 font-medium flex items-center gap-1 ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-500'}`}>
          {trend === 'up' && <TrendingUp size={14} />}
          {trend === 'down' && <TrendingDown size={14} />}
          {subValue}
        </p>
      )}
    </div>
  );

  // Prepare chart data
  const allocationData = holdings
    .filter(h => h.marketValue > 0)
    .sort((a, b) => b.marketValue - a.marketValue)
    .map(h => ({
      name: h.ticker,
      value: h.marketValue
    }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <Button onClick={onAddTransaction}>
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Net Worth" 
          value={formatCurrency(metrics.totalMarketValue)} 
          subValue={formatCurrency(metrics.totalInvested) + " Cost Basis"}
          icon={DollarSign}
        />
        <MetricCard 
          title="Total P/L" 
          value={formatCurrency(metrics.totalPL)} 
          subValue={formatPercent(metrics.totalReturnPercent)}
          trend={metrics.totalPL >= 0 ? 'up' : 'down'}
          icon={Activity}
        />
        <MetricCard 
          title="Unrealized P/L" 
          value={formatCurrency(metrics.totalUnrealizedPL)} 
          subValue={formatPercent(metrics.totalUnrealizedPLPercent)}
          trend={metrics.totalUnrealizedPL >= 0 ? 'up' : 'down'}
          icon={TrendingUp}
        />
        <MetricCard 
          title="Realized P/L" 
          value={formatCurrency(metrics.totalRealizedPL)} 
          subValue="Lifetime"
          trend={metrics.totalRealizedPL >= 0 ? 'up' : 'down'}
          icon={TrendingDown}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocation Chart */}
        <div className="lg:col-span-1 bg-slate-850 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Allocation</h3>
          <div className="h-[300px]">
             {allocationData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                        formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                    No holdings to display
                </div>
             )}
          </div>
        </div>

        {/* Closed Positions Summary */}
        <div className="lg:col-span-2 bg-slate-850 p-6 rounded-xl border border-slate-800 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Closed Positions (Realized P/L)</h3>
          <div className="flex-1 overflow-auto">
             <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 sticky top-0">
                    <tr>
                        <th className="px-4 py-3">Ticker</th>
                        <th className="px-4 py-3 text-right">Realized P/L</th>
                        <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {closedPositions.length > 0 ? (
                        closedPositions.map(p => (
                            <tr key={p.ticker} className="border-b border-slate-800">
                                <td className="px-4 py-3 font-medium">{p.ticker}</td>
                                <td className={`px-4 py-3 text-right font-bold ${p.realizedPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {formatCurrency(p.realizedPL)}
                                </td>
                                <td className="px-4 py-3 text-right text-xs">
                                    <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded">Closed</span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="px-4 py-8 text-center text-slate-500">No closed positions yet.</td>
                        </tr>
                    )}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;