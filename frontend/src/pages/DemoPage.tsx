import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowLeft, ArrowUpRight, RotateCcw, ShieldCheck, TrendingUp } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/Card';

type DemoTrade = {
  id: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  realizedPnl: number;
  createdAt: string;
};

type DemoAccount = {
  cash: number;
  ounces: number;
  averageEntry: number;
  trades: DemoTrade[];
};

const STORAGE_KEY = 'xau-market-pro-public-demo-v1';
const STARTING_BALANCE = 100_000;
const INITIAL_PRICE = 2_350;
const initialAccount: DemoAccount = {
  cash: STARTING_BALANCE,
  ounces: 0,
  averageEntry: 0,
  trades: [],
};

function loadAccount(): DemoAccount {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialAccount;
    const parsed: unknown = JSON.parse(stored);
    if (
      typeof parsed === 'object' && parsed !== null &&
      'cash' in parsed && typeof parsed.cash === 'number' &&
      'ounces' in parsed && typeof parsed.ounces === 'number' &&
      'averageEntry' in parsed && typeof parsed.averageEntry === 'number' &&
      'trades' in parsed && Array.isArray(parsed.trades)
    ) return parsed as DemoAccount;
  } catch {
    // Start with a clean sandbox if local demo data is invalid.
  }
  return initialAccount;
}

const money = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);

export function DemoPage() {
  const [account, setAccount] = useState<DemoAccount>(loadAccount);
  const [price, setPrice] = useState(INITIAL_PRICE);
  const [quantity, setQuantity] = useState('0.10');
  const [message, setMessage] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  }, [account]);

  // A deliberately labeled illustrative price movement; this is not live market data.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setPrice((current) => Math.max(1, current + (Math.random() - 0.48) * 2));
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const qty = Number(quantity);
  const equity = account.cash + account.ounces * price;
  const unrealizedPnl = account.ounces * (price - account.averageEntry);
  const totalPnl = equity - STARTING_BALANCE;
  const canBuy = Number.isFinite(qty) && qty > 0 && qty * price <= account.cash;
  const canSell = Number.isFinite(qty) && qty > 0 && qty <= account.ounces;
  const recentTrades = useMemo(() => account.trades.slice(0, 8), [account.trades]);

  const trade = (side: DemoTrade['side']) => {
    if (side === 'BUY' && !canBuy) {
      setMessage(qty > 0 ? 'Saldo virtual tidak mencukupi.' : 'Masukkan kuantitas yang valid.');
      return;
    }
    if (side === 'SELL' && !canSell) {
      setMessage(qty > account.ounces ? 'Jumlah emas virtual tidak mencukupi untuk dijual.' : 'Masukkan kuantitas yang valid.');
      return;
    }

    const realizedPnl = side === 'SELL' ? (price - account.averageEntry) * qty : 0;
    const nextOunces = side === 'BUY' ? account.ounces + qty : account.ounces - qty;
    const nextAverage = side === 'BUY'
      ? (account.ounces * account.averageEntry + qty * price) / nextOunces
      : nextOunces === 0 ? 0 : account.averageEntry;
    const newTrade: DemoTrade = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      side,
      quantity: qty,
      price,
      realizedPnl,
      createdAt: new Date().toISOString(),
    };

    setAccount((current) => ({
      cash: current.cash + (side === 'SELL' ? qty * price : -qty * price),
      ounces: nextOunces,
      averageEntry: nextAverage,
      trades: [newTrade, ...current.trades].slice(0, 50),
    }));
    setMessage(`${side === 'BUY' ? 'Pembelian' : 'Penjualan'} demo ${qty.toFixed(2)} oz berhasil dicatat.`);
  };

  const reset = () => {
    if (!window.confirm('Reset saldo dan seluruh riwayat demo?')) return;
    setAccount(initialAccount);
    setPrice(INITIAL_PRICE);
    setMessage('Akun demo telah direset ke saldo awal.');
  };

  return (
    <main className="min-h-screen bg-dark-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-dark-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Kembali ke login
          </Link>
          <Link to="/register"><Button variant="gold">Buat akun gratis</Button></Link>
        </header>

        <section className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 sm:p-5" aria-label="Peringatan mode demo">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <p className="font-semibold text-amber-200">MODE DEMO — saldo virtual, tanpa transaksi uang sungguhan</p>
              <p className="mt-1 text-sm text-dark-200">Harga dan pergerakan pada halaman ini hanya simulasi, bukan kuotasi live. Data demo disimpan di browser ini dan tidak terhubung ke deposit, penarikan, atau pembayaran.</p>
            </div>
          </div>
        </section>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400">XAU Market Pro</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Coba trading emas gratis</h1>
          <p className="mt-2 text-dark-300">Latihan beli dan jual XAUUSD dengan akun sandbox tanpa perlu login.</p>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Ringkasan akun demo">
          <Card><CardContent className="pt-6"><p className="text-sm text-dark-400">Saldo virtual</p><p className="mt-2 text-2xl font-bold tabular-nums">{money(account.cash)}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-dark-400">Nilai akun</p><p className="mt-2 text-2xl font-bold tabular-nums">{money(equity)}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-dark-400">Emas dimiliki</p><p className="mt-2 text-2xl font-bold tabular-nums">{account.ounces.toFixed(2)} oz</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-dark-400">Total P/L simulasi</p><p className={`mt-2 text-2xl font-bold tabular-nums ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{totalPnl >= 0 ? '+' : ''}{money(totalPnl)}</p></CardContent></Card>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary-400" /> XAUUSD sandbox</CardTitle>
              <CardDescription>Harga ilustratif yang bergerak setiap beberapa detik</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-dark-400">Harga simulasi per troy ounce</p>
              <p className="mt-1 text-4xl font-bold tabular-nums">{money(price)}</p>
              <p className={`mt-2 text-sm ${unrealizedPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>P/L belum terealisasi: {unrealizedPnl >= 0 ? '+' : ''}{money(unrealizedPnl)}</p>
              <div className="mt-6 space-y-4">
                <label htmlFor="demo-quantity" className="block text-sm font-medium text-dark-200">Kuantitas (troy oz)</label>
                <input id="demo-quantity" type="number" min="0.01" max="100" step="0.01" value={quantity} onChange={(event) => setQuantity(event.target.value)} className="w-full rounded-lg border border-dark-700 bg-dark-800 px-4 py-3 text-white outline-none focus:border-primary-500" />
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => trade('BUY')} disabled={!canBuy} className="w-full"><ArrowUpRight className="h-4 w-4" /> Beli virtual</Button>
                  <Button onClick={() => trade('SELL')} disabled={!canSell} variant="danger" className="w-full"><ArrowDownRight className="h-4 w-4" /> Jual virtual</Button>
                </div>
                {message && <p role="status" className="text-sm text-primary-300">{message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div><CardTitle>Portofolio demo</CardTitle><CardDescription>Posisi virtual saat ini</CardDescription></div>
              <Button variant="ghost" size="sm" onClick={reset} aria-label="Reset akun demo"><RotateCcw className="h-4 w-4" /> Reset</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b border-dark-700 pb-3 text-sm"><span className="text-dark-400">Posisi XAUUSD</span><span className="font-medium">{account.ounces.toFixed(2)} oz</span></div>
              <div className="flex justify-between border-b border-dark-700 pb-3 text-sm"><span className="text-dark-400">Rata-rata harga beli</span><span className="font-medium">{account.averageEntry ? money(account.averageEntry) : '—'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-dark-400">P/L belum terealisasi</span><span className={unrealizedPnl >= 0 ? 'text-green-400' : 'text-red-400'}>{unrealizedPnl >= 0 ? '+' : ''}{money(unrealizedPnl)}</span></div>
              <p className="rounded-lg bg-dark-800 p-3 text-xs leading-5 text-dark-400">Satu troy ounce XAUUSD dikalikan harga simulasi. Tidak ada order yang dikirim ke bursa atau sistem pembayaran.</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Riwayat transaksi simulasi</CardTitle><CardDescription>Riwayat tersimpan lokal di browser ini</CardDescription></CardHeader>
          <CardContent>
            {recentTrades.length === 0 ? <p className="py-8 text-center text-sm text-dark-400">Belum ada transaksi. Coba beli emas virtual untuk memulai.</p> : (
              <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="text-dark-400"><tr className="border-b border-dark-700"><th className="pb-3 pr-4 font-medium">Waktu</th><th className="pb-3 pr-4 font-medium">Aksi</th><th className="pb-3 pr-4 font-medium">Kuantitas</th><th className="pb-3 pr-4 font-medium">Harga simulasi</th><th className="pb-3 font-medium">P/L terealisasi</th></tr></thead><tbody>{recentTrades.map((item) => <tr key={item.id} className="border-b border-dark-800"><td className="py-3 pr-4 text-dark-300">{new Date(item.createdAt).toLocaleString()}</td><td className={`py-3 pr-4 font-semibold ${item.side === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>{item.side}</td><td className="py-3 pr-4 tabular-nums">{item.quantity.toFixed(2)} oz</td><td className="py-3 pr-4 tabular-nums">{money(item.price)}</td><td className={`py-3 tabular-nums ${item.realizedPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{item.side === 'BUY' ? '—' : `${item.realizedPnl >= 0 ? '+' : ''}${money(item.realizedPnl)}`}</td></tr>)}</tbody></table></div>
            )}
          </CardContent>
        </Card>
        <footer className="pb-6 text-center text-xs text-dark-500">Simulasi edukasi saja, bukan saran investasi atau layanan transaksi keuangan.</footer>
      </div>
    </main>
  );
}
