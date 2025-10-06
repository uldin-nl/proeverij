<?php

namespace App\Events;

use App\Models\SessionParticipant;
use App\Models\TastingSession;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ParticipantJoined implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public TastingSession $session,
        public SessionParticipant $participant
    ) {
        $this->participant->load('user');
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('tasting-session.' . $this->session->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'session' => $this->session,
            'participant' => $this->participant,
            'message' => $this->participant->user->name . ' is toegetreden tot de proeverij!'
        ];
    }

    public function broadcastAs(): string
    {
        return 'participant.joined';
    }
}
