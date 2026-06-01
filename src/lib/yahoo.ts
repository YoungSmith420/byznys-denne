// Sdílená utilita pro Yahoo Finance API autentizaci
// Zkouší 2 zdroje cookies × 2 crumb hosty = až 4 kombinace

export const YAHOO_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/** Extrahuje Set-Cookie z response headers (Node.js getSetCookie() + fallback) */
function extractSetCookies(headers: Headers): string {
  let parts: string[] = [];
  if (typeof (headers as any).getSetCookie === 'function') {
    parts = ((headers as any).getSetCookie() as string[])
      .map((c: string) => c.split(';')[0]);
  } else {
    const raw = headers.get('set-cookie') ?? '';
    if (raw) parts = [raw.split(';')[0]];
  }
  return parts.filter(Boolean).join('; ');
}

/**
 * Získá platný Yahoo Finance crumb + cookies.
 *
 * Strategie (v pořadí):
 *  1. fc.yahoo.com   → query2 crumb
 *  2. fc.yahoo.com   → query1 crumb
 *  3. finance.yahoo.com → query2 crumb
 *  4. finance.yahoo.com → query1 crumb
 *
 * Uspěje při první platné kombinaci, ostatní vynechá.
 */
export async function getYahooCrumb(): Promise<{ crumb: string; cookies: string }> {
  const errors: string[] = [];

  const cookieSources = [
    'https://fc.yahoo.com/',
    'https://finance.yahoo.com/',
  ];
  const crumbHosts = [
    'https://query2.finance.yahoo.com',
    'https://query1.finance.yahoo.com',
  ];

  for (const src of cookieSources) {
    let cookies = '';

    try {
      const r = await fetch(src, {
        headers: {
          'User-Agent': YAHOO_UA,
          'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Connection': 'keep-alive',
        },
        signal: AbortSignal.timeout(8_000),
        redirect: 'follow',
      });
      cookies = extractSetCookies(r.headers);
      if (!cookies) {
        errors.push(`${src} → žádné cookies (HTTP ${r.status})`);
        continue;
      }
    } catch (e) {
      errors.push(`${src} → ${e}`);
      continue;
    }

    for (const qh of crumbHosts) {
      try {
        const cr = await fetch(`${qh}/v1/test/getcrumb`, {
          headers: {
            'User-Agent': YAHOO_UA,
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cookie': cookies,
            'Referer': 'https://finance.yahoo.com/',
            'Origin': 'https://finance.yahoo.com',
          },
          signal: AbortSignal.timeout(6_000),
        });

        if (!cr.ok) {
          errors.push(`${qh} crumb → HTTP ${cr.status}`);
          continue;
        }

        const crumb = (await cr.text()).trim();

        // Platný crumb: krátký alfanumerický řetězec (10-30 znaků), žádné HTML/JSON
        if (
          !crumb ||
          crumb.length > 60 ||
          crumb.includes('{') ||
          crumb.includes('<') ||
          crumb.includes(' ') ||
          crumb.includes('\n')
        ) {
          errors.push(`${qh} crumb → neplatná hodnota "${crumb.slice(0, 50)}"`);
          continue;
        }

        // Úspěch!
        return { crumb, cookies };
      } catch (e) {
        errors.push(`${qh} crumb → ${e}`);
      }
    }
  }

  throw new Error(`Yahoo Finance auth selhala — ${errors.join(' | ')}`);
}

/** Fetch Yahoo Finance v7/quote pro dávku symbolů */
export async function fetchYahooQuotes(
  symbols: string[],
  crumb: string,
  cookies: string,
): Promise<any[]> {
  const url =
    `https://query1.finance.yahoo.com/v7/finance/quote` +
    `?symbols=${encodeURIComponent(symbols.join(','))}` +
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

/** Fetch Yahoo Finance v7/spark (historická data) pro dávku max 20 symbolů */
export async function fetchYahooSpark(
  symbols: string[],
  crumb: string,
  cookies: string,
  range = '1mo',
): Promise<Map<string, number>> {
  const url =
    `https://query1.finance.yahoo.com/v7/finance/spark` +
    `?symbols=${encodeURIComponent(symbols.join(','))}` +
    `&range=${range}&interval=1d` +
    `&crumb=${encodeURIComponent(crumb)}`;

  const result = new Map<string, number>();

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

  if (!res.ok) return result;

  const data = await res.json().catch(() => null);
  for (const item of data?.spark?.result ?? []) {
    const sym = item?.symbol as string;
    const prev = item?.response?.[0]?.meta?.chartPreviousClose as number | undefined;
    if (sym && prev != null && prev > 0) result.set(sym, prev);
  }
  return result;
}
