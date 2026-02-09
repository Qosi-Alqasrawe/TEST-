// Fetches real market data from Yahoo Finance via a CORS proxy to bypass browser restrictions.
// This is a free method suitable for frontend-only applications.

export const fetchCurrentPrices = async (tickers: string[]): Promise<Record<string, number>> => {
  if (tickers.length === 0) return {};
  
  const prices: Record<string, number> = {};
  const uniqueTickers = Array.from(new Set(tickers));

  // Fetch in parallel for speed
  const promises = uniqueTickers.map(async (ticker) => {
    try {
      // Yahoo Finance Chart API endpoint
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
      // Use corsproxy.io to allow this request from the browser
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      const result = data.chart?.result?.[0];
      
      if (result?.meta?.regularMarketPrice) {
        prices[ticker.toUpperCase()] = result.meta.regularMarketPrice;
      }
    } catch (error) {
      console.error(`Error fetching price for ${ticker}:`, error);
      // Fallback: If fetch fails, keep existing price or leave undefined to trigger 'stale' UI
    }
  });

  await Promise.all(promises);
  return prices;
};