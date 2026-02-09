import { Transaction, TransactionType, HoldingState, PortfolioMetrics } from '../types';

/**
 * Core Logic: Calculates the state of the portfolio based on transaction history.
 * Uses Average Cost Basis method.
 */
export const calculatePortfolioState = (
  transactions: Transaction[],
  currentPrices: Record<string, number>
): { 
  holdings: HoldingState[]; 
  metrics: PortfolioMetrics; 
  closedPositions: HoldingState[] 
} => {
  // 1. Sort transactions by date ASC
  const sortedTx = [...transactions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Intermediate state tracking
  const holdingMap = new Map<string, {
    shares: number;
    totalCost: number;
    realizedPL: number;
  }>();

  // 2. Process transactions
  for (const tx of sortedTx) {
    const ticker = tx.ticker.toUpperCase();
    if (!holdingMap.has(ticker)) {
      holdingMap.set(ticker, { shares: 0, totalCost: 0, realizedPL: 0 });
    }

    const position = holdingMap.get(ticker)!;

    if (tx.type === TransactionType.BUY) {
      // Average Cost Formula: Add to total cost, add to shares
      // Cost Basis increases by (Price * Qty) + Fees
      const costOfBuy = (tx.price * tx.quantity) + (tx.fees || 0);
      position.shares += tx.quantity;
      position.totalCost += costOfBuy;
    } else if (tx.type === TransactionType.SELL) {
      // Sell Logic
      // 1. Calculate Avg Cost per Share BEFORE sell
      const avgCostPerShare = position.shares > 0 ? position.totalCost / position.shares : 0;
      
      // 2. Cost of Goods Sold (COGS)
      const cogs = avgCostPerShare * tx.quantity;
      
      // 3. Proceeds
      const proceeds = (tx.price * tx.quantity) - (tx.fees || 0);
      
      // 4. Realized P/L
      const gainLoss = proceeds - cogs;
      
      // Update Position
      position.shares -= tx.quantity;
      position.totalCost -= cogs; // Reduce cost basis by the portion sold
      position.realizedPL += gainLoss;
      
      // Handle tiny floating point errors if shares go to 0
      if (Math.abs(position.shares) < 0.000001) {
        position.shares = 0;
        position.totalCost = 0;
      }
    }
  }

  // 3. Finalize Holdings & Metrics
  const holdings: HoldingState[] = [];
  const closedPositions: HoldingState[] = [];
  let totalMarketValue = 0;
  let totalInvested = 0;
  let totalRealizedPL = 0;
  let totalUnrealizedPL = 0;

  holdingMap.forEach((data, ticker) => {
    // If we have shares, it's an open holding. 
    // If shares are 0 but we have realized P/L history, it's a closed position (or fully exited).
    const price = currentPrices[ticker] || 0; // Default to 0 if no price
    const marketValue = data.shares * price;
    const avgCost = data.shares > 0 ? data.totalCost / data.shares : 0;
    const unrealizedPL = marketValue - data.totalCost;
    
    // Aggregate portfolio totals
    totalRealizedPL += data.realizedPL;
    
    const state: HoldingState = {
      ticker,
      shares: data.shares,
      avgCost: avgCost,
      totalCostBasis: data.totalCost,
      realizedPL: data.realizedPL,
      currentPrice: price,
      marketValue,
      unrealizedPL: data.shares > 0 ? unrealizedPL : 0,
      unrealizedPLPercent: data.totalCost > 0 ? (unrealizedPL / data.totalCost) * 100 : 0,
      allocationPercent: 0 // Will calc later
    };

    if (data.shares > 0.000001) {
      holdings.push(state);
      totalMarketValue += marketValue;
      totalInvested += data.totalCost;
      totalUnrealizedPL += unrealizedPL;
    } else {
      closedPositions.push(state);
    }
  });

  // Calculate Allocation %
  holdings.forEach(h => {
    h.allocationPercent = totalMarketValue > 0 ? (h.marketValue / totalMarketValue) * 100 : 0;
  });

  const metrics: PortfolioMetrics = {
    totalInvested,
    totalMarketValue,
    totalRealizedPL,
    totalUnrealizedPL,
    totalUnrealizedPLPercent: totalInvested > 0 ? (totalUnrealizedPL / totalInvested) * 100 : 0,
    totalPL: totalRealizedPL + totalUnrealizedPL,
    totalReturnPercent: totalInvested > 0 ? ((totalRealizedPL + totalUnrealizedPL) / totalInvested) * 100 : 0,
    cashBalance: 0 // Not tracked deeply in this MVP
  };

  return { holdings, metrics, closedPositions };
};
