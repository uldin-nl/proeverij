import { Button } from '@/components/ui/button';
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
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Wine } from 'lucide-react';
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
];

interface Session {
    id: number;
    name: string;
    description: string | null;
    status: 'draft' | 'active' | 'completed';
    max_rounds: number;
    current_round: number;
    invite_code: string;
    host: {
        id: number;
        name: string;
    };
    participants: Array<{
        id: number;
        user: {
            id: number;
            name: string;
        };
        role: 'host' | 'participant';
    }>;
    starts_at: string | null;
    ends_at: string | null;
    created_at: string;
}

interface Props {
    sessions: {
        data: Session[];
        links: Record<string, unknown>;
        meta: { total?: number } & Record<string, unknown>;
    };
}

export default function SessionsIndex({ sessions: initialSessions }: Props) {
    const [sessions, setSessions] = useState(initialSessions);

    const { data, setData, post, processing } = useForm({
        invite_code: '',
    });

    // Real-time updates for session status changes
    type BroadcastEvent = {
        status?: Session['status'];
        currentRound?: number;
        participant?: Session['participants'][0];
    };

    useEffect(() => {
        const channels: ReturnType<typeof window.Echo.private>[] = [];

        // Listen to each session for status updates
        sessions.data.forEach((session) => {
            const channel = window.Echo.private(
                `tasting-session.${session.id}`,
            );
            channels.push(channel);

            // Listen for session status changes
            channel.listen('SessionStatusChanged', (e: BroadcastEvent) => {
                setSessions((prev) => ({
                    ...prev,
                    data: prev.data.map((s) =>
                        s.id === session.id ? { ...s, status: e.status ?? s.status } : s,
                    ),
                }));
            });

            // Listen for round status changes
            channel.listen('RoundStatusChanged', (e: BroadcastEvent) => {
                setSessions((prev) => ({
                    ...prev,
                    data: prev.data.map((s) =>
                        s.id === session.id
                            ? { ...s, current_round: e.currentRound ?? s.current_round }
                            : s,
                    ),
                }));
            });

            // Listen for new participants
            channel.listen('ParticipantJoined', (e: BroadcastEvent) => {
                setSessions((prev) => ({
                    ...prev,
                    data: prev.data.map((s) =>
                        s.id === session.id && e.participant
                            ? {
                                  ...s,
                                  participants: [
                                      ...s.participants,
                                      e.participant,
                                  ],
                              }
                            : s,
                    ),
                }));
            });
        });

        return () => {
            channels.forEach((channel) => {
                channel.stopListening('SessionStatusChanged');
                channel.stopListening('RoundStatusChanged');
                channel.stopListening('ParticipantJoined');
            });
        };
    }, [sessions.data]);

    const handleJoinSession = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tasting/sessions/join');
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Proeverijen" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Proeverijen
                        </h1>
                        <p className="text-muted-foreground">
                            Organiseer en deel mee aan borrel proeverijen
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/tasting/sessions/create">
                            <Button>
                                <Plus className="h-4 w-4" />
                                Nieuwe proeverij
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Join Session Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wine className="h-5 w-5" />
                                Doe mee aan proeverij
                            </CardTitle>
                            <CardDescription>
                                Voer een uitnodigingscode in om mee te doen aan
                                een proeverij
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleJoinSession}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="invite_code">
                                        Uitnodigingscode
                                    </Label>
                                    <Input
                                        id="invite_code"
                                        type="text"
                                        placeholder="Bijv. ABCD1234"
                                        value={data.invite_code}
                                        onChange={(e) =>
                                            setData(
                                                'invite_code',
                                                e.target.value.toUpperCase(),
                                            )
                                        }
                                        maxLength={8}
                                        className="uppercase"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.invite_code}
                                    className="w-full"
                                >
                                    Doe mee
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistieken</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Totaal proeverijen
                                </span>
                                <span className="font-medium">
                                    {sessions.meta?.total || 0}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Actieve proeverijen
                                </span>
                                <span className="font-medium">
                                    {
                                        sessions.data.filter(
                                            (s) => s.status === 'active',
                                        ).length
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Afgeronde proeverijen
                                </span>
                                <span className="font-medium">
                                    {
                                        sessions.data.filter(
                                            (s) => s.status === 'completed',
                                        ).length
                                    }
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sessions List */}
                <div className="space-y-4">
                    <h2 className="text-lg font-medium">Mijn proeverijen</h2>

                    {sessions.data.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Wine className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-medium">
                                    Nog geen proeverijen
                                </h3>
                                <p className="mb-4 text-center text-muted-foreground">
                                    Organiseer je eerste borrel proeverij of doe
                                    mee aan een bestaande proeverij
                                </p>
                                <Link href="/tasting/sessions/create">
                                    <Button>
                                        <Plus className="h-4 w-4" />
                                        Nieuwe proeverij
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {sessions.data.map((session) => (
                                <Card
                                    key={session.id}
                                    className="transition-shadow hover:shadow-md"
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Link
                                                        href={`/tasting/sessions/${session.id}`}
                                                        className="hover:underline"
                                                    >
                                                        {session.name}
                                                    </Link>
                                                    {getStatusBadge(
                                                        session.status,
                                                    )}
                                                </CardTitle>
                                                {session.description && (
                                                    <CardDescription className="mt-1">
                                                        {session.description}
                                                    </CardDescription>
                                                )}
                                            </div>
                                            <div className="text-right text-sm text-muted-foreground">
                                                <div>
                                                    Host: {session.host.name}
                                                </div>
                                                <div>
                                                    Code: {session.invite_code}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex gap-4">
                                                <span>
                                                    Ronde:{' '}
                                                    {session.current_round}/
                                                    {session.max_rounds}
                                                </span>
                                                <span>
                                                    Deelnemers:{' '}
                                                    {
                                                        session.participants
                                                            .length
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/tasting/sessions/${session.id}`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Bekijken
                                                    </Button>
                                                </Link>
                                                {session.status ===
                                                    'completed' && (
                                                    <Link
                                                        href={`/tasting/sessions/${session.id}/results`}
                                                    >
                                                        <Button size="sm">
                                                            Resultaten
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
