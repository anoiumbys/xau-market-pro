<?php

namespace App\Observers;

use App\Models\AuditLog;
use App\Models\MarketParameter;
use App\Models\PriceAlert;
use App\Models\Subscription;
use App\Models\TradeJournal;
use App\Models\User;

class AuditObserver
{
    public function created($model): void
    {
        $this->log($model, 'created', [], $model->toArray());
    }

    public function updated($model): void
    {
        $changes = $model->getChanges();
        unset($changes['updated_at']);
        
        if (!empty($changes)) {
            $original = [];
            foreach (array_keys($changes) as $key) {
                $original[$key] = $model->getOriginal($key);
            }
            $this->log($model, 'updated', $original, $changes);
        }
    }

    public function deleted($model): void
    {
        $this->log($model, 'deleted', $model->toArray(), []);
    }

    private function log($model, string $action, array $oldValue, array $newValue): void
    {
        $entity = $this->getEntityName($model);
        $entityId = $model->getKey();
        $actor = auth()->user();

        AuditLog::log($action, $entity, $entityId, $oldValue, $newValue, $actor);
    }

    private function getEntityName($model): string
    {
        return class_basename($model);
    }
}

// Specific observers for models with special handling
class UserAuditObserver extends AuditObserver
{
    public function updated(User $user): void
    {
        if ($user->isDirty('role')) {
            AuditLog::log(
                'role_changed',
                'User',
                (string) $user->id,
                ['role' => $user->getOriginal('role')],
                ['role' => $user->role],
                auth()->user()
            );
        }
        parent::updated($user);
    }
}

class SubscriptionAuditObserver extends AuditObserver
{
    public function updated(Subscription $subscription): void
    {
        if ($subscription->isDirty('status')) {
            $action = match ($subscription->status) {
                'active' => 'activated',
                'cancelled' => 'rejected',
                'expired' => 'expired',
                default => 'updated',
            };
            
            AuditLog::log(
                $action,
                'Subscription',
                (string) $subscription->id,
                ['status' => $subscription->getOriginal('status')],
                ['status' => $subscription->status],
                auth()->user()
            );
        }
        parent::updated($subscription);
    }
}

class MarketParameterAuditObserver extends AuditObserver
{
    public function updated(MarketParameter $parameter): void
    {
        $changes = $parameter->getChanges();
        unset($changes['updated_at']);
        
        if (isset($changes['support_levels']) || isset($changes['resistance_levels'])) {
            AuditLog::log(
                'levels_updated',
                'MarketParameter',
                (string) $parameter->id,
                [
                    'support_levels' => $parameter->getOriginal('support_levels'),
                    'resistance_levels' => $parameter->getOriginal('resistance_levels'),
                ],
                [
                    'support_levels' => $parameter->support_levels,
                    'resistance_levels' => $parameter->resistance_levels,
                ],
                auth()->user()
            );
        }
        
        parent::updated($parameter);
    }
}