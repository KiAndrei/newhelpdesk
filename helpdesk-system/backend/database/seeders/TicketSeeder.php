<?php

namespace Database\Seeders;

use App\Models\Ticket;
use Illuminate\Database\Seeder;

/** Optional demo data: php artisan db:seed */
class TicketSeeder extends Seeder
{
    public function run(): void
    {
        if (Ticket::count() > 0) {
            return;
        }

        Ticket::create([
            'requester_name' => 'Maria Santos',
            'requester_email' => 'maria.santos@example.com',
            'issue_category' => 'Network',
            'priority' => 'High',
            'subject' => 'Wi-Fi keeps disconnecting in Lab 2',
            'description' => 'The wireless connection drops every few minutes in Computer Lab 2.',
        ]);

        Ticket::create([
            'requester_name' => 'Juan Dela Cruz',
            'requester_email' => 'juan.delacruz@example.com',
            'issue_category' => 'Account Access',
            'priority' => 'Medium',
            'subject' => 'Cannot log in to student portal',
            'description' => 'Password reset email is not arriving.',
        ]);
    }
}
