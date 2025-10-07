import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle,
    Copy,
    Play,
    SkipForward,
    Star,
    Users,
    Wine,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Proeverijen',
        href: '/tasting/sessions',
    },
    {
        title: 'Proeverij',
        href: '#',
    },
];

interface User {
    id: number;
    name: string;
}

interface Participant {
    id: number;
    user: User;
    role: 'host' | 'participant';
}

interface Drink {
    id: number;
    name: string;
    description: string | null;
    type: string;
    brand: string | null;
    alcohol_percentage: number | null;
    origin: string | null;
}

interface Review {
    id: number;
    rating: number;
    review: string | null;
    tags: string[] | null;
    user: User;
}

interface TastingRound {
    id: number;
    round_number: number;
    status: 'pending' | 'active' | 'completed';
    drink: Drink;
    reviews: Review[];
    average_rating: number;
    started_at: string | null;
    completed_at: string | null;
}

interface TastingSession {
    id: number;
    name: string;
    description: string | null;
    status: 'draft' | 'active' | 'completed';
    max_rounds: number;
    current_round: number;
    invite_code: string;
    host: User;
    participants: Participant[];
    rounds: TastingRound[];
    starts_at: string | null;
    ends_at: string | null;
}

interface Props {
    session: TastingSession;
    userParticipant: Participant | null;
    currentRound: TastingRound | null;
    canManage: boolean;
}

export default function ShowSession({
    session: initialSession,
    userParticipant,
    currentRound: initialCurrentRound,
    canManage,
}: Props) {
    const [copiedCode, setCopiedCode] = useState(false);
    const [session, setSession] = useState(initialSession);
    const [currentRound, setCurrentRound] = useState(initialCurrentRound);
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({
        name: initialSession.name,
        description: initialSession.description || '',
        max_rounds: initialSession.max_rounds,
    });

    const { post: postStart, processing: startProcessing } = useForm({});
    const { post: postNextRound, processing: nextRoundProcessing } = useForm(
        {},
    );
    const {
        data: reviewData,
        setData: setReviewData,
        post: postReview,
        processing: reviewProcessing,
        errors,
    } = useForm({
        rating: 0,
        review: '',
        tags: [] as string[],
    });

    // Real-time updates
    type ParticipantJoinedEvent = {
        participant: Participant;
        session: TastingSession;
        message?: string;
    };

    type ReviewSubmittedEvent = {
        review: Review;
        round: TastingRound;
        message?: string;
    };

    type RoundStatusChangedEvent = {
        round: TastingRound;
        session: TastingSession;
        previousStatus?: string;
        message?: string;
    };

    type SessionStatusChangedEvent = {
        session: TastingSession;
        previousStatus?: string;
        message?: string;
    };

    useEffect(() => {
        const channel = window.Echo.private(`tasting-session.${session.id}`);

        channel.listen('.participant.joined', (e: ParticipantJoinedEvent) => {
            if (e.participant) {
                setSession((prev) => {
                    // Check if participant already exists
                    const participantExists = prev.participants.some(
                        (p) => p.id === e.participant.id
                    );
                    
                    if (participantExists) {
                        return prev; // Don't add duplicate
                    }
                    
                    return {
                        ...prev,
                        participants: [...prev.participants, e.participant],
                    };
                });
            }
        });

        channel.listen('.review.submitted', (e: ReviewSubmittedEvent) => {
            if (e.review) {
                // Update current round if it matches
                if (currentRound && e.round.id === currentRound.id) {
                    setCurrentRound((prev) =>
                        prev
                            ? {
                                  ...prev,
                                  reviews: [
                                      ...(prev.reviews || []).filter((r) => r.id !== e.review.id),
                                      e.review,
                                  ],
                                  average_rating: e.round.average_rating,
                              }
                            : prev,
                    );
                }

                // Update session rounds list
                setSession((prev) => ({
                    ...prev,
                    rounds: prev.rounds.map((round) =>
                        round.id === e.round.id
                            ? {
                                  ...round,
                                  reviews: [
                                      ...(round.reviews || []).filter((r) => r.id !== e.review.id),
                                      e.review,
                                  ],
                                  average_rating: e.round.average_rating,
                              }
                            : round,
                    ),
                }));
            }
        });

        channel.listen('.round.status.changed', (e: RoundStatusChangedEvent) => {
            setSession((prev) => ({
                ...prev,
                current_round: e.session.current_round,
                rounds: prev.rounds.map((round) =>
                    round.id === e.round.id ? e.round : round,
                ),
                status: e.session.status,
            }));

            if (e.round.status === 'active') {
                setCurrentRound(e.round);
            }
        });

        channel.listen('.session.status.changed', (e: SessionStatusChangedEvent) => {
            setSession((prev) => ({
                ...prev,
                status: e.session.status,
            }));

            if (e.session.status === 'completed') {
                setTimeout(() => {
                    router.visit(`/tasting/sessions/${session.id}/results`);
                }, 2000);
            }
        });

        return () => {
            channel.stopListening('.participant.joined');
            channel.stopListening('.review.submitted');
            channel.stopListening('.round.status.changed');
            channel.stopListening('.session.status.changed');
        };
    }, [session.id, currentRound]);

    // Reset review form when current round changes
    useEffect(() => {
        setReviewData({
            rating: 0,
            review: '',
            tags: [] as string[],
        });
    }, [currentRound?.id, setReviewData]);

    const copyInviteCode = async () => {
        try {
            await navigator.clipboard.writeText(session.invite_code);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        } catch {
            console.error('Failed to copy invite code');
        }
    };

    const handleStartSession = () => {
        postStart(`/tasting/sessions/${session.id}/start`);
    };

    const handleNextRound = () => {
        postNextRound(`/tasting/sessions/${session.id}/next-round`);
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentRound) {
            postReview(`/tasting/rounds/${currentRound.id}/review`);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            active: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-300',
            completed:
                'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-300',
        };

        const labels = {
            draft: 'Concept',
            active: 'Actief',
            completed: 'Afgerond',
        };

        return (
            <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${variants[status as keyof typeof variants]}`}
            >
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    const getTypeDisplay = (type: string) => {
        const types = {
            beer: 'Bier',
            wine: 'Wijn',
            spirits: 'Sterke drank',
            cocktail: 'Cocktail',
            other: 'Anders',
        };
        return types[type as keyof typeof types] || type;
    };

    const currentUserReview = currentRound?.reviews?.find(
        (r) => r.user?.id === userParticipant?.user?.id,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={session.name} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center gap-4">
                    <Link href="/tasting/sessions">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                            Terug
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {session.name}
                            </h1>
                            {getStatusBadge(session.status)}
                        </div>
                        {session.description && (
                            <p className="mt-1 text-muted-foreground">
                                {session.description}
                            </p>
                        )}
                    </div>
                    {session.status === 'completed' && (
                        <Link href={`/tasting/sessions/${session.id}/results`}>
                            <Button>Bekijk resultaten</Button>
                        </Link>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Session Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wine className="h-5 w-5" />
                                Proeverij info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Host
                                </span>
                                <span>{session.host.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Ronde
                                </span>
                                <span>
                                    {session.current_round}/{session.max_rounds}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Deelnemers
                                </span>
                                <span>{session.participants.length}</span>
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm text-muted-foreground">
                                    Uitnodigingscode
                                </span>
                                <div className="flex gap-2">
                                    <Input
                                        value={session.invite_code}
                                        readOnly
                                        className="font-mono"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={copyInviteCode}
                                    >
                                        {copiedCode ? (
                                            <CheckCircle className="h-4 w-4" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Participants */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Deelnemers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {session.participants.map((participant) => (
                                    <div
                                        key={participant.id}
                                        className="flex items-center justify-between"
                                    >
                                        <span>{participant.user.name}</span>
                                        {participant.role === 'host' && (
                                            <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                                                Host
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Controls */}
                    {canManage && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Beheer</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {session.status === 'draft' && (
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            onClick={handleStartSession}
                                            disabled={startProcessing}
                                            className="w-full"
                                        >
                                            <Play className="h-4 w-4" />
                                            Start proeverij
                                        </Button>
                                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full">
                                                    Bewerken
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Proeverij bewerken</DialogTitle>
                                                    <DialogDescription>
                                                        Pas de naam, beschrijving en aantal rondes aan.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <form
                                                    onSubmit={e => {
                                                        e.preventDefault();
                                                        // TODO: Replace with actual update logic (API call)
                                                        setSession({
                                                            ...session,
                                                            name: editData.name,
                                                            description: editData.description,
                                                            max_rounds: editData.max_rounds,
                                                        });
                                                        setEditOpen(false);
                                                    }}
                                                    className="space-y-4"
                                                >
                                                    <Label htmlFor="edit-name">Naam</Label>
                                                    <Input
                                                        id="edit-name"
                                                        type="text"
                                                        value={editData.name}
                                                        onChange={e => setEditData({ ...editData, name: e.target.value })}
                                                    />
                                                    <Label htmlFor="edit-description">Beschrijving</Label>
                                                    <Input
                                                        id="edit-description"
                                                        type="text"
                                                        value={editData.description}
                                                        onChange={e => setEditData({ ...editData, description: e.target.value })}
                                                    />
                                                    <Label htmlFor="edit-max-rounds">Aantal rondes</Label>
                                                    <Input
                                                        id="edit-max-rounds"
                                                        type="number"
                                                        min={1}
                                                        max={20}
                                                        value={editData.max_rounds}
                                                        onChange={e => setEditData({ ...editData, max_rounds: Number(e.target.value) })}
                                                    />
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button type="button" variant="outline">Annuleren</Button>
                                                        </DialogClose>
                                                        <Button type="submit">Opslaan</Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                )}

                                {session.status === 'active' &&
                                    session.current_round <
                                        session.max_rounds && (
                                        <Button
                                            onClick={handleNextRound}
                                            disabled={nextRoundProcessing}
                                            className="w-full"
                                        >
                                            <SkipForward className="h-4 w-4" />
                                            Volgende ronde
                                        </Button>
                                    )}

                                {session.status === 'active' &&
                                    session.current_round >=
                                        session.max_rounds && (
                                        <Button
                                            onClick={handleNextRound}
                                            disabled={nextRoundProcessing}
                                            className="w-full"
                                        >
                                            Proeverij afronden
                                        </Button>
                                    )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Current Round */}
                {currentRound && session.status === 'active' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Ronde {currentRound.round_number}:{' '}
                                {currentRound.drink.name}
                            </CardTitle>
                            <CardDescription>
                                Proef dit drankje en geef je beoordeling
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Drink Info */}
                                <div className="space-y-4">
                                    <h3 className="font-medium">
                                        Drankje informatie
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex gap-2">
                                            <span className="rounded bg-muted px-2 py-1 text-xs">
                                                {getTypeDisplay(
                                                    currentRound.drink.type,
                                                )}
                                            </span>
                                        </div>
                                        {currentRound.drink.brand && (
                                            <p>
                                                <span className="text-muted-foreground">
                                                    Merk:
                                                </span>{' '}
                                                {currentRound.drink.brand}
                                            </p>
                                        )}
                                        {currentRound.drink.origin && (
                                            <p>
                                                <span className="text-muted-foreground">
                                                    Herkomst:
                                                </span>{' '}
                                                {currentRound.drink.origin}
                                            </p>
                                        )}
                                        {currentRound.drink
                                            .alcohol_percentage && (
                                            <p>
                                                <span className="text-muted-foreground">
                                                    Alcohol:
                                                </span>{' '}
                                                {
                                                    currentRound.drink
                                                        .alcohol_percentage
                                                }
                                                %
                                            </p>
                                        )}
                                        {currentRound.drink.description && (
                                            <p className="text-muted-foreground">
                                                {currentRound.drink.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Review Form */}
                                <div className="space-y-4">
                                    <h3 className="font-medium">
                                        Jouw beoordeling
                                    </h3>

                                    {currentUserReview ? (
                                        <div className="space-y-3 rounded-lg bg-muted p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    Je beoordeling:
                                                </span>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <Star
                                                                key={star}
                                                                className={`h-4 w-4 ${
                                                                    star <=
                                                                    currentUserReview.rating
                                                                        ? 'fill-yellow-400 text-yellow-400'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                            {currentUserReview.review && (
                                                <p className="text-sm">
                                                    {currentUserReview.review}
                                                </p>
                                            )}
                                            {currentUserReview.tags &&
                                                currentUserReview.tags.length >
                                                    0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {currentUserReview.tags.map(
                                                            (tag, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="rounded bg-primary/10 px-2 py-1 text-xs text-primary"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    ) : (
                                        <form
                                            onSubmit={handleSubmitReview}
                                            className="space-y-4"
                                        >
                                            <div className="space-y-2">
                                                <Label>
                                                    Sterren beoordeling *
                                                </Label>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() =>
                                                                    setReviewData(
                                                                        'rating',
                                                                        star,
                                                                    )
                                                                }
                                                                className="p-1"
                                                            >
                                                                <Star
                                                                    className={`h-6 w-6 transition-colors ${
                                                                        star <=
                                                                        reviewData.rating
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'text-gray-300 hover:text-yellow-200'
                                                                    }`}
                                                                />
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                                {errors.rating && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.rating}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="review">
                                                    Review (optioneel)
                                                </Label>
                                                <Input
                                                    id="review"
                                                    type="text"
                                                    placeholder="Hoe vond je dit drankje?"
                                                    value={reviewData.review}
                                                    onChange={(e) =>
                                                        setReviewData(
                                                            'review',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={
                                                    reviewProcessing ||
                                                    reviewData.rating === 0
                                                }
                                                className="w-full"
                                            >
                                                {reviewProcessing
                                                    ? 'Bezig...'
                                                    : 'Beoordeling opslaan'}
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </div>

                            {/* Other Reviews */}
                            {currentRound.reviews?.length > 0 && (
                                <div className="mt-6 space-y-4">
                                    <h3 className="font-medium">
                                        Andere beoordelingen
                                    </h3>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {currentRound.reviews
                                            ?.filter(
                                                (review) =>
                                                    review.user?.id !==
                                                    userParticipant?.user?.id,
                                            )
                                            .map((review) => (
                                                <div
                                                    key={review.id}
                                                    className="rounded-lg border p-3"
                                                >
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span className="text-sm font-medium">
                                                            {review.user?.name}
                                                        </span>
                                                        <div className="flex gap-1">
                                                            {[
                                                                1, 2, 3, 4, 5,
                                                            ].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`h-3 w-3 ${
                                                                        star <=
                                                                        review.rating
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'text-gray-300'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {review.review && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {review.review}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Rounds Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Rondes overzicht</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {session.rounds.map((round) => (
                                <div
                                    key={round.id}
                                    className={`rounded-lg border p-4 ${
                                        round.status === 'active'
                                            ? 'border-primary bg-primary/5'
                                            : round.status === 'completed'
                                              ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                                              : 'border-border'
                                    }`}
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="font-medium">
                                            Ronde {round.round_number}
                                        </span>
                                        <span
                                            className={`rounded px-2 py-1 text-xs ${
                                                round.status === 'active'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : round.status ===
                                                        'completed'
                                                      ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-300'
                                                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                            }`}
                                        >
                                            {round.status === 'active'
                                                ? 'Actief'
                                                : round.status === 'completed'
                                                  ? 'Afgerond'
                                                  : 'Wachtend'}
                                        </span>
                                    </div>
                                    <h4 className="mb-1 text-sm font-medium">
                                        {round.drink.name}
                                    </h4>
                                    <p className="mb-2 text-xs text-muted-foreground">
                                        {getTypeDisplay(round.drink.type)}
                                        {round.drink.brand &&
                                            ` • ${round.drink.brand}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
