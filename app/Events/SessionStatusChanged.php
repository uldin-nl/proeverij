<?php

namespace App\Events;

use App\Models\TastingSession;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SessionStatusChanged implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public TastingSession $session,
        public string $previousStatus
    ) {
        $this->session->load(['host', 'participants.user']);
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('tasting-session.' . $this->session->id),
        ];
    }

    public function broadcastWith(): array
    {
        $messages = [
            'active' => 'Proeverij is gestart!',
            'completed' => 'Proeverij is afgerond! Bekijk de resultaten.',
        ];

        return [
            'session' => $this->session,
            'previousStatus' => $this->previousStatus,
            'message' => $messages[$this->session->status] ?? 'Proeverij status gewijzigd'
        ];
    }

    public function broadcastAs(): string
    {
        return 'session.status.changed';
    }
}
