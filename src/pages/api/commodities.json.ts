// Server-side proxy pro komodity — Yahoo Finance futures
export const prerender = false;

import { getYahooCrumb, fetchYahooSpark, YAHOO_UA } from '../../lib/yahoo';

export const COMMODITY_LIST = [
  { symbol: 'GC=F',  name: 'Zlato',       unit: 'USD/oz' },
  { symbol: 'SI=F',  name: 'Stříbro',     unit: 'USD/oz' },
  { symbol: 'PL=F',  name: 'Platina',     unit: 'USD/oz' },
  { symbol: 'PA=F',  name: 'Palladium',   unit: 'USD/oz' },
  { symbol: 'HG=F',  name: 'Měď',         unit: 'USD/lb' },
  { symbol: 'CL=F',  name: 'Ropa WTI',    unit: 'USD/bbl' },
  { symbol: 'BZ=F',  name: 'Ropa Brent',  unit: 'USD/bbl' },
  { symbol: 'NG=F',  name: 'Zemní plyn',  unit: 'USD/MMBtu' },
  { symbol: 'RB=F',  name: 'Benzín',      unit: 'USD/gal' },
  { symbol: 'UX=F',  name: 'Uran',        unit: 'USD/lb' },
  { symbol: 'ZW=F',  name: 'Pšenice',     unit: 'USX/bu' },
  { symbol: 'ZC=F',  name: 'Kukuřice',    unit: 'USX/bu' },
  { symbol: 'ZS=F',  name: 'Sója',        unit: 'USX/bu' },
  { symbol: 'CC=F',  name: 'Kakao',       unit: 'USD/MT' },
  { symbol: 'KC=F',  name: 'Káva',        unit: 'USX/lb' },
  { symbol: 'SB=F',  name: 'Cukr',        unit: 'USX/lb' },
  { symbol: 'CT=F',  name: 'Bavlna',      unit: 'USX/lb' },
  { symbol: 'LBS=F', name: 'Dřevo',       unit: 'USD/MBF' },
  { symbol: 'HE=F',  name: 'Vepřové',     unit: 'USX/lb' },
  { symbol: 'EH=F',  name: 'Etanol',      unit: 'USD/gal' },
] as const;

const SYMBOLS  = COMMODITY_LIST.map(c => c.symbol);
const INFO_MAP = new Map(COMMODITY_LIST.map((c, i) => [c.symbol, { ...c, rank: i + 1 }]));

// ── Fetch všech komodit najednou ────────────────────────────────────────────
async function fetchCommodities(crumb: string, cookies: string): Promise<any[]> {
  const url =
    `https://query1.finance.yahoo.com/v7/finance/quote` +
    `?symbols=${encodeURIComponent(SYMBOLS.join(','))}` +
    `&crumb=${encodeURIComponent(crumb)}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': YAHOO_UA,
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cookie': cookies,
      'Referer': 'https://finance.yahoo.com/',
    },
    signal: AbortSignal.timeout(14_000),
  });

  if (!res.ok) throw new Error(`Yahoo HTTP ${res.status}`);
  const data = await res.json();
  return data?.quoteResponse?.result ?? [];
}

// ── GET handler ─────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const { crumb, cookies } = await getYahooCrumb();

    // Fáze 1: quote data
    const raw = await fetchCommodities(crumb, cookies);

    // Fáze 2: spark 30d + 7d (paralelně)
    const [spark30Result, spark7Result] = await Promise.allSettled([
      fetchYahooSpark(SYMBOLS as unknown as string[], crumb, cookies, '1mo'),
      fetchYahooSpark(SYMBOLS as unknown as string[], crumb, cookies, '5d'),
    ]);

    const sparkMap30 = spark30Result.status === 'fulfilled' ? spark30Result.value : new Map<string, number>();
    const sparkMap7  = spark7Result.status  === 'fulfilled' ? spark7Result.value  : new Map<string, number>();

    const quoteMap = new Map(raw.map((q: any) => [q.symbol as string, q]));

    const commodities = SYMBOLS
      .map((sym, idx) => {
        const q    = quoteMap.get(sym);
        const info = INFO_MAP.get(sym)!;
        if (!q) return null;
        const raw52 = q.fiftyTwoWeekChangePercent;
        const cur   = q.regularMarketPrice as number | undefined;
        const prev7  = sparkMap7.get(sym);
        const prev30 = sparkMap30.get(sym);
        return {
          rank:         idx + 1,
          symbol:       sym,
          name:         info.name,
          fullName:     q.shortName || info.name,
          unit:         info.unit,
          w52High:      (q.fiftyTwoWeekHigh != null && isFinite(q.fiftyTwoWeekHigh)) ? q.fiftyTwoWeekHigh : null,
          w52Low:       (q.fiftyTwoWeekLow  != null && isFinite(q.fiftyTwoWeekLow))  ? q.fiftyTwoWeekLow  : null,
          price:        cur ?? 0,
          change:       q.regularMarketChange        ?? 0,
          changePct:    q.regularMarketChangePercent ?? 0,
          m7ChangePct:  (cur != null && prev7  != null && prev7  > 0)
            ? parseFloat(((cur - prev7)  / prev7  * 100).toFixed(2)) : null,
          m30ChangePct: (cur != null && prev30 != null && prev30 > 0)
            ? parseFloat(((cur - prev30) / prev30 * 100).toFixed(2)) : null,
          w52ChangePct: (raw52 != null && isFinite(raw52))
            ? parseFloat(raw52.toFixed(2)) : null,
        };
      })
      .filter(Boolean);

    return new Response(
      JSON.stringify({ commodities, count: commodities.length, updatedAt: new Date().toISOString() }),
      {
        status: commodities.length > 0 ? 200 : 502,
        headers: {
          'Content-Type':                'application/json',
          'Cache-Control':               'no-store',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  } catch (err) {
    console.error('[commodities.json]', err);
    return new Response(
      JSON.stringify({ error: String(err), commodities: [], count: 0 }),
      {
        status: 502,
        headers: {
          'Content-Type':                'application/json',
          'Cache-Control':               'no-store',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }
}
