export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface Transaction {
  id: string;
  date: string; // ISO YYYY-MM-DD
  ticker: string;
  type: TransactionType;
  quantity: number;
  price: number;
  fees: number;
  currency: string;
  createdAt: number;
}

export interface HoldingState {
  ticker: string;
  shares: number;
  avgCost: number; // Weighted average cost per share
  totalCostBasis: number; // Total invested in current shares
  realizedPL: number; // Cumulative realized P/L for this ticker
  currentPrice: number; // Last known market price
  marketValue: number; // shares * currentPrice
  unrealizedPL: number; // marketValue - totalCostBasis
  unrealizedPLPercent: number;
  allocationPercent: number; // % of total portfolio value
}

export interface PortfolioMetrics {
  totalInvested: number;
  totalMarketValue: number;
  totalUnrealizedPL: number;
  totalUnrealizedPLPercent: number;
  totalRealizedPL: number;
  totalPL: number; // Realized + Unrealized
  totalReturnPercent: number;
  cashBalance: number; // Virtual cash based on sells - buys (optional tracking)
}

export interface PortfolioSnapshot {
  date: string;
  marketValue: number;
  invested: number;
}
