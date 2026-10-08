<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'audit_logs';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'actor_id',
        'action',
        'entity',
        'entity_id',
        'old_value',
        'new_value',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'old_value' => 'array',
            'new_value' => 'array',
        ];
    }

    // Relationships
    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    // Scopes
    public function scopeForEntity($query, string $entity, ?string $entityId = null)
    {
        $query->where('entity', $entity);
        if ($entityId) {
            $query->where('entity_id', $entityId);
        }

        return $query;
    }

    public function scopeByActor($query, int $actorId)
    {
        return $query->where('actor_id', $actorId);
    }

    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    // Helpers
    public static function log(
        string $action,
        string $entity,
        ?string $entityId = null,
        array $oldValue = [],
        array $newValue = [],
        ?User $actor = null
    ): self {
        return self::create([
            'actor_id' => $actor?->id ?? auth()->id(),
            'action' => $action,
            'entity' => $entity,
            'entity_id' => $entityId,
            'old_value' => $oldValue ?: null,
            'new_value' => $newValue ?: null,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function getActionLabel(): string
    {
        return match ($this->action) {
            'created' => 'Created',
            'updated' => 'Updated',
            'deleted' => 'Deleted',
            'approved' => 'Approved',
            'rejected' => 'Rejected',
            'activated' => 'Activated',
            'suspended' => 'Suspended',
            'role_changed' => 'Role Changed',
            default => ucfirst($this->action),
        };
    }
}
