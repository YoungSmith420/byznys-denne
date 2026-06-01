// Server-side proxy: 52-týdenní high/low kryptoměn z Yahoo Finance
// CoinGecko symbol "btc" → Yahoo Finance "BTC-USD"
export const prerender = false;

import { getYahooCrumb, fetchYahooQuotes } from '../../lib/yahoo';

// GET ?symbols=BTC-USD,ETH-USD,BNB-USD,...
export async function GET({ request }: { request: Request }) {
  const params  = new URL(request.url).searchParams;
  const rawSyms = params.get('symbols') ?? '';
  const symbols = rawSyms.split(',').map(s => s.trim()).filter(Boolean);

  const emptyResp = (status = 200) => new Response(
    JSON.stringify({ data: {} }),
    {
      status,
      headers: {
        'Content-Type':                'application/json',
        'Cache-Control':               'no-store',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );

  if (symbols.length === 0) return emptyResp();

  try {
    const { crumb, cookies } = await getYahooCrumb();

    // Dávky po 50 symbolech
    const BATCH = 50;
    const batches: string[][] = [];
    for (let i = 0; i < symbols.length; i += BATCH) {
      batches.push(symbols.slice(i, i + BATCH));
    }

    const results = await Promise.allSettled(
      batches.map(b => fetchYahooQuotes(b, crumb, cookies)),
    );

    const data: Record<string, { w52High: number | null; w52Low: number | null }> = {};
    for (const r of results) {
      if (r.status !== 'fulfilled') continue;
      for (const q of r.value) {
        if (!q?.symbol) continue;
        const h = q.fiftyTwoWeekHigh as number | undefined;
        const l = q.fiftyTwoWeekLow  as number | undefined;
        data[q.symbol] = {
          w52High: (h != null && isFinite(h) && h > 0) ? h : null,
          w52Low:  (l != null && isFinite(l) && l > 0) ? l : null,
        };
      }
    }

    return new Response(
      JSON.stringify({ data }),
      {
        headers: {
          'Content-Type':                'application/json',
          'Cache-Control':               'no-store',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  } catch (err) {
    console.error('[crypto-52w.json]', err);
    return emptyResp(502);
  }
}
