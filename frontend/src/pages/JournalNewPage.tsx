import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useJournalStore } from '@stores/journalStore';
import { useMarketStore } from '@stores/marketStore';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@components/ui/Card';
import { toast } from 'sonner';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@utils/cn';

// 1 pip XAUUSD = $0.01 (10 pips = $1.00)
const PIP_USD = 0.01;
const LIVE_SYMBOL = 'XAUUSD';
const POLL_MS = 5000;

const journalSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  direction: z.enum(['long', 'short']),
  entry_price: z.coerce.number().positive('Entry price must be positive'),
  lot_size: z.coerce.number().positive('Lot size must be positive'),
  stop_loss: z.coerce.number().positive().optional().nullable(),
  take_profit: z.coerce.number().positive().optional().nullable(),
  notes: z.string().optional(),
});

type JournalForm = z.infer<typeof journalSchema>;

function priceFromPips(entry: number, direction: 'long' | 'short', pips: number, isStop: boolean) {
  const delta = pips * PIP_USD;
  if (direction === 'long') {
    return isStop ? entry - delta : entry + delta;
  }
  return isStop ? entry + delta : entry - delta;
}

function round4(n: number) {
  return Math.round(n * 10000) / 10000;
}

export function JournalNewPage() {
  const navigate = useNavigate();
  const createTrade = useJournalStore((state) => state.createTrade);
  const isLoading = useJournalStore((state) => state.isLoading);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentMarket = useMarketStore((state) => state.currentMarket);
  const fetchMarket = useMarketStore((state) => state.fetchMarket);
  // Tolerant: accept both raw and {data}-wrapped shapes.
  const marketObj = (currentMarket as unknown as { data?: unknown })?.data ?? currentMarket;
  const livePrice =
    (marketObj as { symbol?: string; spot_price?: unknown })?.symbol === LIVE_SYMBOL
      ? Number((marketObj as { spot_price?: unknown })?.spot_price) || null
      : null;

  // Entry follows live price until the user types manually.
  const [entryAuto, setEntryAuto] = useState(true);
  const prevLiveRef = useRef<number | null>(null);

  // SL/TP in pips (UI only, converted to price). Price fields stay editable.
  const [slPips, setSlPips] = useState('');
  const [tpPips, setTpPips] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JournalForm>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      symbol: LIVE_SYMBOL,
      direction: 'long',
      entry_price: 0,
      lot_size: 0.01,
    },
  });

  const direction = watch('direction');
  const entryPrice = watch('entry_price');
  const stopLoss = watch('stop_loss');
  const takeProfit = watch('take_profit');

  // Poll live price.
  useEffect(() => {
    fetchMarket(LIVE_SYMBOL);
    const t = setInterval(() => fetchMarket(LIVE_SYMBOL), POLL_MS);
    return () => clearInterval(t);
  }, [fetchMarket]);

  // Auto-fill entry while in auto mode; stop when the user diverges manually.
  useEffect(() => {
    if (!entryAuto || livePrice == null) return;
    const cur = Number(entryPrice);
    const prev = prevLiveRef.current;
    const untouched = !cur || cur === 0 || (prev != null && cur === prev);
    if (untouched) {
      setValue('entry_price', livePrice, { shouldValidate: true });
      // Keep SL/TP following while auto.
      const sl = parseFloat(slPips);
      if (!Number.isNaN(sl) && sl > 0) {
        setValue('stop_loss', round4(priceFromPips(livePrice, direction, sl, true)), {
          shouldValidate: true,
        });
      }
      const tp = parseFloat(tpPips);
      if (!Number.isNaN(tp) && tp > 0) {
        setValue('take_profit', round4(priceFromPips(livePrice, direction, tp, false)), {
          shouldValidate: true,
        });
      }
    } else {
      setEntryAuto(false);
    }
    prevLiveRef.current = livePrice;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [livePrice]);

  // Recompute SL/TP prices when direction changes and pips are set.
  useEffect(() => {
    const entry = Number(entryPrice);
    if (!entry || entry <= 0) return;
    const sl = parseFloat(slPips);
    if (!Number.isNaN(sl) && sl > 0) {
      setValue('stop_loss', round4(priceFromPips(entry, direction, sl, true)), {
        shouldValidate: true,
      });
    }
    const tp = parseFloat(tpPips);
    if (!Number.isNaN(tp) && tp > 0) {
      setValue('take_profit', round4(priceFromPips(entry, direction, tp, false)), {
        shouldValidate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction]);

  const useLivePrice = () => {
    if (livePrice != null) {
      setValue('entry_price', livePrice, { shouldValidate: true });
      prevLiveRef.current = livePrice;
      setEntryAuto(true);
    } else {
      fetchMarket(LIVE_SYMBOL);
    }
  };

  const handleSlPipsChange = (v: string) => {
    setSlPips(v);
    const pips = parseFloat(v);
    const entry = Number(entryPrice);
    if (!Number.isNaN(pips) && pips > 0 && entry > 0) {
      setValue('stop_loss', round4(priceFromPips(entry, direction, pips, true)), {
        shouldValidate: true,
      });
    }
  };

  const handleTpPipsChange = (v: string) => {
    setTpPips(v);
    const pips = parseFloat(v);
    const entry = Number(entryPrice);
    if (!Number.isNaN(pips) && pips > 0 && entry > 0) {
      setValue('take_profit', round4(priceFromPips(entry, direction, pips, false)), {
        shouldValidate: true,
      });
    }
  };

  const riskReward =
    stopLoss != null && takeProfit != null && Number(entryPrice) > 0
      ? (() => {
          const risk = Math.abs(Number(entryPrice) - Number(stopLoss));
          const reward = Math.abs(Number(takeProfit) - Number(entryPrice));
          return risk > 0 ? Math.round((reward / risk) * 100) / 100 : null;
        })()
      : null;

  const onSubmit = async (data: JournalForm) => {
    setIsSubmitting(true);
    try {
      await createTrade({
        symbol: data.symbol,
        direction: data.direction,
        entry_price: data.entry_price,
        lot_size: data.lot_size,
        stop_loss: data.stop_loss ?? null,
        take_profit: data.take_profit ?? null,
        notes: data.notes ?? '',
      } as Parameters<typeof createTrade>[0]);
      toast.success('Trade journal created successfully');
      navigate('/journal');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to create trade journal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/journal" className="btn-ghost btn-icon">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">New Trade Journal</h1>
          <p className="mt-1 text-dark-400">Record a new trade entry</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-3">
            <span>Live Price</span>
            <span className="flex items-center gap-2 text-sm font-normal">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1',
                  entryAuto
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-dark-700 text-dark-300'
                )}
              >
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    entryAuto ? 'animate-pulse bg-green-400' : 'bg-dark-500'
                  )}
                />
                {livePrice != null ? `XAUUSD ${livePrice}` : 'Connecting...'}
              </span>
              <Button
                type="button"
                variant="secondary"
                onClick={() => fetchMarket(LIVE_SYMBOL)}
                className="px-2"
                title="Refresh harga kini"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEntryAuto((v) => !v)}
                title={entryAuto ? 'Kunci entry (stop auto)' : 'Ikuti harga live lagi'}
              >
                {entryAuto ? 'Auto: ON' : 'Auto: OFF'}
              </Button>
            </span>
          </CardTitle>
          <CardDescription>
            Entry mengikuti harga realtime sampai kamu ketik manual. 1 pip = $0.01.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Symbol"
                placeholder="XAUUSD"
                {...register('symbol')}
                error={errors.symbol?.message}
              />
              <Select
                label="Direction"
                {...register('direction')}
                options={[
                  { value: 'long', label: 'Long' },
                  { value: 'short', label: 'Short' },
                ]}
                error={errors.direction?.message}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Input
                  label="Entry Price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register('entry_price')}
                  error={errors.entry_price?.message}
                  helperText={
                    entryAuto ? 'Mengikuti harga live (ketik untuk kunci manual)' : 'Manual (klik di bawah untuk ikut live lagi)'
                  }
                />
                {!entryAuto && (
                  <button
                    type="button"
                    onClick={useLivePrice}
                    className="mt-1.5 text-xs text-primary-400 hover:text-primary-300"
                  >
                    Pakai harga live kini{livePrice != null ? ` (${livePrice})` : ''}
                  </button>
                )}
              </div>
              <Input
                label="Lot Size"
                type="number"
                step="0.01"
                min="0.01"
                {...register('lot_size')}
                error={errors.lot_size?.message}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="SL (pips)"
                type="number"
                step="0.1"
                min="0"
                placeholder="mis. 50 (= $0.50)"
                value={slPips}
                onChange={(e) => handleSlPipsChange(e.target.value)}
                helperText="Otomatis isi harga Stop Loss"
              />
              <Input
                label="TP (pips)"
                type="number"
                step="0.1"
                min="0"
                placeholder="mis. 100 (= $1.00)"
                value={tpPips}
                onChange={(e) => handleTpPipsChange(e.target.value)}
                helperText="Otomatis isi harga Take Profit"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Stop Loss (harga)"
                type="number"
                step="0.01"
                min="0.01"
                {...register('stop_loss')}
                error={errors.stop_loss?.message}
                helperText="Bisa edit manual"
              />
              <Input
                label="Take Profit (harga)"
                type="number"
                step="0.01"
                min="0.01"
                {...register('take_profit')}
                error={errors.take_profit?.message}
                helperText="Bisa edit manual"
              />
            </div>

            {riskReward != null && (
              <p className="text-sm text-dark-300">
                Estimasi risk/reward: <span className="font-semibold text-white">{riskReward}</span>
                {slPips && tpPips ? ` (${slPips} / ${tpPips} pips)` : ''}
              </p>
            )}

            <div className="space-y-2">
              <label className="label">Notes</label>
              <textarea
                rows={4}
                placeholder="Add any notes about this trade..."
                {...register('notes')}
                className={cn(
                  'w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2 text-white placeholder-dark-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500',
                  errors.notes && 'border-red-500 focus:ring-red-500'
                )}
              />
              {errors.notes && <p className="mt-1 text-sm text-red-400">{errors.notes.message}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3">
            <Link to="/journal">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button type="submit" loading={isSubmitting || isLoading}>
              Create Trade
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
