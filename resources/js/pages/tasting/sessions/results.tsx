import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Crown, Star, Trophy, Wine } from 'lucide-react';

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
        title: 'Resultaten',
        href: '#',
    },
];

interface User {
    id: number;
    name: string;
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

interface Result {
    round_number: number;
    drink: Drink;
    average_rating: number;
    total_reviews: number;
    reviews: Review[];
}

interface TastingSession {
    id: number;
    name: string;
    description: string | null;
    max_rounds: number;
    host: User;
    participants: Array<{
        id: number;
        user: User;
        role: 'host' | 'participant';
    }>;
}

interface Props {
    session: TastingSession;
    results: Result[];
}

export default function SessionResults({ session, results }: Props) {
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

    const getRankIcon = (index: number) => {
        if (index === 0) return <Crown className="h-5 w-5 text-yellow-500" />;
        if (index === 1) return <Trophy className="h-5 w-5 text-gray-400" />;
        if (index === 2) return <Trophy className="h-5 w-5 text-amber-600" />;
        return (
            <span className="text-lg font-bold text-muted-foreground">
                #{index + 1}
            </span>
        );
    };

    const getCardStyle = (index: number) => {
        if (index === 0)
            return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/10';
        if (index === 1)
            return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/10';
        if (index === 2)
            return 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/10';
        return '';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Resultaten - ${session.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center gap-4">
                    <Link href={`/tasting/sessions/${session.id}`}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                            Terug naar proeverij
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            <Trophy className="h-6 w-6" />
                            Resultaten: {session.name}
                        </h1>
                        <p className="text-muted-foreground">
                            Bekijk de volledige resultaten van de proeverij
                        </p>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Wine className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Drankjes geproefd
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {results.length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Gemiddelde score
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {results.length > 0
                                            ? (
                                                  results.reduce(
                                                      (sum, r) =>
                                                          sum +
                                                          r.average_rating,
                                                      0,
                                                  ) / results.length
                                              ).toFixed(1)
                                            : '0'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Crown className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Winnaar
                                    </p>
                                    <p className="truncate text-lg font-bold">
                                        {results.length > 0
                                            ? results[0].drink.name
                                            : 'Geen'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-primary"></div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Deelnemers
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {session.participants?.length || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Ranking */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5" />
                            Eindranglijst
                        </CardTitle>
                        <CardDescription>
                            Drankjes gerangschikt op gemiddelde beoordeling
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {results.map((result, index) => (
                                <Card
                                    key={result.round_number}
                                    className={getCardStyle(index)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 bg-background">
                                                {getRankIcon(index)}
                                            </div>

                                            <div className="flex-1">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold">
                                                        {result.drink.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex gap-0.5">
                                                            {[
                                                                1, 2, 3, 4, 5,
                                                            ].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`h-4 w-4 ${
                                                                        star <=
                                                                        Math.round(
                                                                            result.average_rating,
                                                                        )
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'text-gray-300'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-lg font-bold">
                                                            {result.average_rating.toFixed(
                                                                1,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="rounded bg-muted px-2 py-1 text-xs">
                                                        Ronde{' '}
                                                        {result.round_number}
                                                    </span>
                                                    <span className="rounded bg-muted px-2 py-1 text-xs">
                                                        {getTypeDisplay(
                                                            result.drink.type,
                                                        )}
                                                    </span>
                                                    {result.drink.brand && (
                                                        <span>
                                                            {result.drink.brand}
                                                        </span>
                                                    )}
                                                    <span>
                                                        {result.total_reviews}{' '}
                                                        review
                                                        {result.total_reviews !==
                                                        1
                                                            ? 's'
                                                            : ''}
                                                    </span>
                                                </div>

                                                {result.drink.description && (
                                                    <p className="mb-3 text-sm text-muted-foreground">
                                                        {
                                                            result.drink
                                                                .description
                                                        }
                                                    </p>
                                                )}

                                                {/* Individual Reviews */}
                                                <div className="grid gap-2 md:grid-cols-2">
                                                    {result.reviews.map(
                                                        (review) => (
                                                            <div
                                                                key={review.id}
                                                                className="rounded bg-background/50 p-2 text-sm"
                                                            >
                                                                <div className="mb-1 flex items-center justify-between">
                                                                    <span className="font-medium">
                                                                        {
                                                                            review
                                                                                .user
                                                                                .name
                                                                        }
                                                                    </span>
                                                                    <div className="flex gap-0.5">
                                                                        {[
                                                                            1,
                                                                            2,
                                                                            3,
                                                                            4,
                                                                            5,
                                                                        ].map(
                                                                            (
                                                                                star,
                                                                            ) => (
                                                                                <Star
                                                                                    key={
                                                                                        star
                                                                                    }
                                                                                    className={`h-3 w-3 ${
                                                                                        star <=
                                                                                        review.rating
                                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                                            : 'text-gray-300'
                                                                                    }`}
                                                                                />
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {review.review && (
                                                                    <p className="text-xs text-muted-foreground">
                                                                        "
                                                                        {
                                                                            review.review
                                                                        }
                                                                        "
                                                                    </p>
                                                                )}
                                                                {review.tags &&
                                                                    review.tags
                                                                        .length >
                                                                        0 && (
                                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                                            {review.tags.map(
                                                                                (
                                                                                    tag,
                                                                                    tagIndex,
                                                                                ) => (
                                                                                    <span
                                                                                        key={
                                                                                            tagIndex
                                                                                        }
                                                                                        className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary"
                                                                                    >
                                                                                        {
                                                                                            tag
                                                                                        }
                                                                                    </span>
                                                                                ),
                                                                            )}
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Participants */}
                <Card>
                    <CardHeader>
                        <CardTitle>Deelnemers</CardTitle>
                        <CardDescription>
                            Alle deelnemers aan deze proeverij
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                            {session.participants?.map((participant) => (
                                <div
                                    key={participant.id}
                                    className="flex items-center justify-between rounded-lg bg-muted p-3"
                                >
                                    <span className="font-medium">
                                        {participant.user.name}
                                    </span>
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

                {/* Actions */}
                <div className="flex justify-between gap-4">
                    <Link href="/tasting/sessions">
                        <Button variant="outline">Terug naar overzicht</Button>
                    </Link>
                    <div className="flex gap-2">
                        <Link href="/tasting/sessions/create">
                            <Button>Nieuwe proeverij</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
