<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    public const CATEGORIES = ['Hardware', 'Software', 'Network', 'Account Access', 'Other'];
    public const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
    public const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

    protected $fillable = [
        'requester_name',
        'requester_email',
        'issue_category',
        'priority',
        'subject',
        'description',
        'status',
    ];

    protected $attributes = [
        'status' => 'Open',
    ];

    protected static function booted(): void
    {
        // Generate TKT-0001, TKT-0002, ... from the primary key right after insert.
        static::created(function (Ticket $ticket) {
            $ticket->forceFill([
                'ticket_number' => sprintf('TKT-%04d', $ticket->id),
            ])->saveQuietly();
        });
    }
}
