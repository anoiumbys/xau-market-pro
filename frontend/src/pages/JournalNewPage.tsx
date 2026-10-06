import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useJournalStore } from '@stores/journalStore';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@components/ui/Card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@utils/cn';

const journalSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  direction: z.enum(['long', 'short']),
  entry_price: z.coerce.number().positive('Entry price must be positive'),
  exit_price: z.coerce.number().positive().optional().nullable(),
  lot_size: z.coerce.number().positive('Lot size must be positive'),
  stop_loss: z.coerce.number().positive().optional().nullable(),
  take_profit: z.coerce.number().positive().optional().nullable(),
  status: z.enum(['open', 'closed']),
  notes: z.string().optional(),
});

type JournalForm = z.infer<typeof journalSchema>;

export function JournalNewPage() {
  const navigate = useNavigate();
  const createTrade = useJournalStore((state) => state.createTrade);
  const isLoading = useJournalStore((state) => state.isLoading);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JournalForm>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      symbol: 'XAUUSD',
      direction: 'long',
      status: 'open',
      entry_price: 0,
      lot_size: 0.01,
    },
  });

  const onSubmit = async (data: JournalForm) => {
    setIsSubmitting(true);
    try {
      await createTrade({
        ...data,
        exit_price: data.exit_price ?? null,
        stop_loss: data.stop_loss ?? null,
        take_profit: data.take_profit ?? null,
        notes: data.notes ?? '',
      });
      toast.success('Trade journal created successfully');
      navigate('/journal');
    } catch (error) {
      toast.error('Failed to create trade journal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/journal" className="btn-ghost btn-icon">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">New Trade Journal</h1>
          <p className="text-dark-400 mt-1">Record a new trade entry</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trade Details</CardTitle>
          <CardDescription>Fill in the details of your trade</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Entry Price"
                type="number"
                step="0.01"
                min="0.01"
                {...register('entry_price')}
                error={errors.entry_price?.message}
              />
              <Input
                label="Lot Size"
                type="number"
                step="0.01"
                min="0.01"
                {...register('lot_size')}
                error={errors.lot_size?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Exit Price (Optional)"
                type="number"
                step="0.01"
                min="0.01"
                {...register('exit_price')}
                error={errors.exit_price?.message}
              />
              <Input
                label="Stop Loss (Optional)"
                type="number"
                step="0.01"
                min="0.01"
                {...register('stop_loss')}
                error={errors.stop_loss?.message}
              />
              <Input
                label="Take Profit (Optional)"
                type="number"
                step="0.01"
                min="0.01"
                {...register('take_profit')}
                error={errors.take_profit?.message}
              />
            </div>

            <Select
              label="Status"
              {...register('status')}
              options={[
                { value: 'open', label: 'Open' },
                { value: 'closed', label: 'Closed' },
              ]}
              error={errors.status?.message}
            />

            <div className="space-y-2">
              <label className="label">Notes</label>
              <textarea
                rows={4}
                placeholder="Add any notes about this trade..."
                {...register('notes')}
                className={cn(
                  'w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
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