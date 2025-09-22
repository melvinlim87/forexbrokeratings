import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbolsParam = searchParams.get('symbols');
    if (!symbolsParam) {
      return NextResponse.json({ error: 'Missing symbols' }, { status: 400 });
    }

    const symbols = symbolsParam.split(',').map(s => s.trim()).filter(Boolean);
    if (symbols.length === 0) {
      return NextResponse.json({ error: 'No valid symbols provided' }, { status: 400 });
    }

    // yahoo-finance2 supports array input for quote
    const quotes = await yahooFinance.quote(symbols as any);

    // Normalize to array
    const list = Array.isArray(quotes) ? quotes : [quotes];

    // Reduce payload
    const result = list.map(q => ({
      symbol: q.symbol,
      shortName: (q as any).shortName,
      regularMarketPrice: (q as any).regularMarketPrice,
      regularMarketChangePercent: (q as any).regularMarketChangePercent,
    }));

    return NextResponse.json({ result });
  } catch (err: any) {
    console.error('yahoo-finance2 error', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
