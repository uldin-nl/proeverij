<?php

namespace App\Events;

use App\Models\TastingReview;
use App\Models\TastingRound;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReviewSubmitted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public TastingReview $review,
        public TastingRound $round
    ) {
        $this->review->load('user');
        $this->round->load('tastingSession');
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('tasting-session.' . $this->round->tastingSession->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'review' => $this->review,
            'round' => $this->round,
            'message' => $this->review->user->name . ' heeft een beoordeling gegeven!'
        ];
    }

    public function broadcastAs(): string
    {
        return 'review.submitted';
    }
}
