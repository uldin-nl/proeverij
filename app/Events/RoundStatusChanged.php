<?php

namespace App\Events;

use App\Models\TastingRound;
use App\Models\TastingSession;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RoundStatusChanged implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public TastingRound $round,
        public TastingSession $session,
        public string $previousStatus
    ) {
        $this->round->load('drink');
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
            'active' => 'Ronde ' . $this->round->round_number . ' is gestart!',
            'completed' => 'Ronde ' . $this->round->round_number . ' is afgerond!',
        ];

        return [
            'round' => $this->round,
            'session' => $this->session,
            'previousStatus' => $this->previousStatus,
            'message' => $messages[$this->round->status] ?? 'Ronde status gewijzigd'
        ];
    }

    public function broadcastAs(): string
    {
        return 'round.status.changed';
    }
}
