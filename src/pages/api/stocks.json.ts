// Server-side proxy — Yahoo Finance s crumb/cookie autentizací
export const prerender = false;

import { getYahooCrumb, fetchYahooSpark, YAHOO_UA } from '../../lib/yahoo';

const STOCK_INFO: [string, string, string][] = [
  ['AAPL',  'Apple',                    'apple.com'],
  ['MSFT',  'Microsoft',                'microsoft.com'],
  ['NVDA',  'NVIDIA',                   'nvidia.com'],
  ['AMZN',  'Amazon',                   'amazon.com'],
  ['META',  'Meta Platforms',           'meta.com'],
  ['GOOGL', 'Alphabet (Google)',         'google.com'],
  ['TSLA',  'Tesla',                    'tesla.com'],
  ['BRK-B', 'Berkshire Hathaway',       'berkshirehathaway.com'],
  ['JPM',   'JPMorgan Chase',           'jpmorganchase.com'],
  ['LLY',   'Eli Lilly',                'lilly.com'],
  ['V',     'Visa',                     'visa.com'],
  ['UNH',   'UnitedHealth Group',       'unitedhealthgroup.com'],
  ['AVGO',  'Broadcom',                 'broadcom.com'],
  ['XOM',   'ExxonMobil',               'exxonmobil.com'],
  ['MA',    'Mastercard',               'mastercard.com'],
  ['COST',  'Costco',                   'costco.com'],
  ['JNJ',   'Johnson & Johnson',        'jnj.com'],
  ['HD',    'Home Depot',               'homedepot.com'],
  ['PG',    'Procter & Gamble',         'pg.com'],
  ['WMT',   'Walmart',                  'walmart.com'],
  ['NFLX',  'Netflix',                  'netflix.com'],
  ['BAC',   'Bank of America',          'bankofamerica.com'],
  ['CRM',   'Salesforce',               'salesforce.com'],
  ['ABBV',  'AbbVie',                   'abbvie.com'],
  ['CVX',   'Chevron',                  'chevron.com'],
  ['KO',    'Coca-Cola',                'coca-cola.com'],
  ['MRK',   'Merck',                    'merck.com'],
  ['AMD',   'AMD',                      'amd.com'],
  ['ORCL',  'Oracle',                   'oracle.com'],
  ['TMUS',  'T-Mobile',                 't-mobile.com'],
  ['GS',    'Goldman Sachs',            'goldmansachs.com'],
  ['ACN',   'Accenture',                'accenture.com'],
  ['NOW',   'ServiceNow',               'servicenow.com'],
  ['PEP',   'PepsiCo',                  'pepsico.com'],
  ['TMO',   'Thermo Fisher Scientific', 'thermofisher.com'],
  ['ADBE',  'Adobe',                    'adobe.com'],
  ['IBM',   'IBM',                      'ibm.com'],
  ['QCOM',  'Qualcomm',                 'qualcomm.com'],
  ['TXN',   'Texas Instruments',        'ti.com'],
  ['WFC',   'Wells Fargo',              'wellsfargo.com'],
  ['MCD',   "McDonald's",               'mcdonalds.com'],
  ['ISRG',  'Intuitive Surgical',       'intuitivesurgical.com'],
  ['AMGN',  'Amgen',                    'amgen.com'],
  ['CAT',   'Caterpillar',              'caterpillar.com'],
  ['MS',    'Morgan Stanley',           'morganstanley.com'],
  ['GE',    'GE Aerospace',             'ge.com'],
  ['SYK',   'Stryker',                  'stryker.com'],
  ['AXP',   'American Express',         'americanexpress.com'],
  ['SPGI',  'S&P Global',               'spglobal.com'],
  ['BA',    'Boeing',                   'boeing.com'],
  ['RTX',   'RTX',                      'rtx.com'],
  ['LMT',   'Lockheed Martin',          'lockheedmartin.com'],
  ['MDT',   'Medtronic',                'medtronic.com'],
  ['BLK',   'BlackRock',                'blackrock.com'],
  ['C',     'Citigroup',                'citi.com'],
  ['CSCO',  'Cisco',                    'cisco.com'],
  ['DE',    'John Deere',               'deere.com'],
  ['HON',   'Honeywell',                'honeywell.com'],
  ['TGT',   'Target',                   'target.com'],
  ['GILD',  'Gilead Sciences',          'gilead.com'],
  ['NEE',   'NextEra Energy',           'nexteraenergy.com'],
  ['LOW',   "Lowe's",                   'lowes.com'],
  ['UNP',   'Union Pacific',            'up.com'],
  ['ETN',   'Eaton',                    'eaton.com'],
  ['BX',    'Blackstone',               'blackstone.com'],
  ['REGN',  'Regeneron',                'regeneron.com'],
  ['UBER',  'Uber',                     'uber.com'],
  ['CB',    'Chubb',                    'chubb.com'],
  ['PLD',   'Prologis',                 'prologis.com'],
  ['INTU',  'Intuit',                   'intuit.com'],
  ['MMM',   '3M',                       '3m.com'],
  ['AMAT',  'Applied Materials',        'appliedmaterials.com'],
  ['CME',   'CME Group',                'cmegroup.com'],
  ['BKNG',  'Booking Holdings',         'bookingholdings.com'],
  ['CI',    'Cigna',                    'cigna.com'],
  ['ADI',   'Analog Devices',           'analog.com'],
  ['LRCX',  'Lam Research',             'lamresearch.com'],
  ['ELV',   'Elevance Health',          'elevancehealth.com'],
  ['PANW',  'Palo Alto Networks',       'paloaltonetworks.com'],
  ['DHR',   'Danaher',                  'danaher.com'],
  ['HUM',   'Humana',                   'humana.com'],
  ['BMY',   'Bristol-Myers Squibb',     'bms.com'],
  ['SHW',   'Sherwin-Williams',         'sherwin-williams.com'],
  ['ZTS',   'Zoetis',                   'zoetis.com'],
  ['MO',    'Altria',                   'altria.com'],
  ['PM',    'Philip Morris Intl.',      'pmi.com'],
  ['ABT',   'Abbott',                   'abbott.com'],
  ['DIS',   'Walt Disney',              'disney.com'],
  ['T',     'AT&T',                     'att.com'],
  ['CMCSA', 'Comcast',                  'comcast.com'],
  ['COP',   'ConocoPhillips',           'conocophillips.com'],
  ['EOG',   'EOG Resources',            'eogresources.com'],
  ['SLB',   'SLB',                      'slb.com'],
  ['MMC',   'Marsh McLennan',           'marshmclennan.com'],
  ['AON',   'Aon',                      'aon.com'],
  ['ADP',   'ADP',                      'adp.com'],
  ['ITW',   'Illinois Tool Works',      'itw.com'],
  ['SO',    'Southern Company',         'southerncompany.com'],
  ['EMR',   'Emerson Electric',         'emerson.com'],
  ['NSC',   'Norfolk Southern',         'norfolksouthern.com'],
  ['MCO',   "Moody's",                  'moodys.com'],
  ['PNC',   'PNC Financial',            'pnc.com'],
  ['USB',   'U.S. Bancorp',             'usbank.com'],
];

const SYMBOLS  = STOCK_INFO.map(s => s[0]);
const INFO_MAP = new Map(STOCK_INFO.map(([sym, name, domain], i) => [sym, { name, domain, rank: i + 1 }]));

// ── Batch dotaz na kurzy ────────────────────────────────────────────────────
async function fetchBatch(syms: string[], crumb: string, cookies: string): Promise<any[]> {
  const url =
    `https://query1.finance.yahoo.com/v7/finance/quote` +
    `?symbols=${encodeURIComponent(syms.join(','))}` +
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

  if (!res.ok) throw new Error(`Yahoo quote HTTP ${res.status}`);
  const data = await res.json();
  return data?.quoteResponse?.result ?? [];
}

// ── Hlavní GET handler ──────────────────────────────────────────────────────
export async function GET() {
  try {
    const { crumb, cookies } = await getYahooCrumb();

    const half = Math.ceil(SYMBOLS.length / 2);

    // Fáze 1: quote data (2 paralelní batche)
    const [b1, b2] = await Promise.allSettled([
      fetchBatch(SYMBOLS.slice(0, half), crumb, cookies),
      fetchBatch(SYMBOLS.slice(half),    crumb, cookies),
    ]);

    // Fáze 2 & 3: spark data pro 30d a 7d — max 20 symbolů/dotaz
    const SPARK_SZ = 20;
    const sparkBatches: string[][] = [];
    for (let i = 0; i < SYMBOLS.length; i += SPARK_SZ) {
      sparkBatches.push(SYMBOLS.slice(i, i + SPARK_SZ));
    }

    // 30d + 7d paralelně
    const [spark30Results, spark7Results] = await Promise.all([
      Promise.allSettled(sparkBatches.map(b => fetchYahooSpark(b, crumb, cookies, '1mo'))),
      Promise.allSettled(sparkBatches.map(b => fetchYahooSpark(b, crumb, cookies, '5d'))),
    ]);

    const sparkMap30 = new Map<string, number>();
    for (const r of spark30Results) {
      if (r.status === 'fulfilled') r.value.forEach((v, k) => sparkMap30.set(k, v));
    }
    const sparkMap7 = new Map<string, number>();
    for (const r of spark7Results) {
      if (r.status === 'fulfilled') r.value.forEach((v, k) => sparkMap7.set(k, v));
    }

    const raw = [
      ...(b1.status === 'fulfilled' ? b1.value : []),
      ...(b2.status === 'fulfilled' ? b2.value : []),
    ];

    const quoteMap = new Map(raw.map((q: any) => [q.symbol as string, q]));

    const stocks = SYMBOLS
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
          name:         q.shortName || info.name,
          peRatio:      (q.trailingPE != null && isFinite(q.trailingPE) && q.trailingPE > 0)
            ? parseFloat(q.trailingPE.toFixed(2)) : null,
          dividendPct:  (q.trailingAnnualDividendYield != null && isFinite(q.trailingAnnualDividendYield) && q.trailingAnnualDividendYield > 0)
            ? parseFloat((q.trailingAnnualDividendYield * 100).toFixed(2)) : null,
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
          logoUrl:      `https://logo.clearbit.com/${info.domain}`,
          domain:       info.domain,
        };
      })
      .filter(Boolean);

    return new Response(
      JSON.stringify({ stocks, count: stocks.length, updatedAt: new Date().toISOString() }),
      {
        status: stocks.length > 0 ? 200 : 502,
        headers: {
          'Content-Type':                'application/json',
          'Cache-Control':               'no-store',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  } catch (err) {
    console.error('[stocks.json]', err);
    return new Response(
      JSON.stringify({ error: String(err), stocks: [], count: 0 }),
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
