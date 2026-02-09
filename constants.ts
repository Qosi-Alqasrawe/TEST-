export const APP_NAME = "Portfoli.io";

export const STORAGE_KEYS = {
  TRANSACTIONS: 'portfoliio_transactions_v1',
  PRICES: 'portfoliio_prices_v1',
};

// Simple mock initial data if empty
export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx_1',
    date: '2023-01-15',
    ticker: 'AAPL',
    type: 'BUY',
    quantity: 10,
    price: 150.00,
    fees: 5.00,
    currency: 'USD',
    createdAt: 1673740800000
  },
  {
    id: 'tx_2',
    date: '2023-02-10',
    ticker: 'MSFT',
    type: 'BUY',
    quantity: 5,
    price: 260.00,
    fees: 2.00,
    currency: 'USD',
    createdAt: 1675987200000
  },
  {
    id: 'tx_3',
    date: '2023-06-20',
    ticker: 'AAPL',
    type: 'SELL',
    quantity: 2,
    price: 185.00,
    fees: 1.00,
    currency: 'USD',
    createdAt: 1687219200000
  }
];
