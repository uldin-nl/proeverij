import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    Plus,
    Star,
    Trophy,
    Users,
    Wine,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Welkom bij Proeverij
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Organiseer en deel mee aan interactieve borrel
                            proeverijen
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

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="cursor-pointer transition-shadow hover:shadow-md">
                        <Link href="/tasting/sessions/create">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-primary/10 p-2">
                                        <Plus className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Nieuwe proeverij
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Start een borrel proeverij
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Link>
                    </Card>

                    <Card className="cursor-pointer transition-shadow hover:shadow-md">
                        <Link href="/tasting/sessions">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                                        <Calendar className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Mijn proeverijen
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Bekijk alle proeverijen
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Link>
                    </Card>

                    <Card className="cursor-pointer transition-shadow hover:shadow-md">
                        <Link href="/tasting/drinks">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                                        <Wine className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Drankjes
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Beheer drankjes database
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Link>
                    </Card>

                    <Card className="cursor-pointer transition-shadow hover:shadow-md">
                        <Link href="/tasting/drinks/create">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
                                        <Plus className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Drankje toevoegen
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Nieuw drankje toevoegen
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Link>
                    </Card>
                </div>

                {/* How it Works */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5" />
                            Hoe werkt het?
                        </CardTitle>
                        <CardDescription>
                            Volg deze stappen om een succesvolle borrel
                            proeverij te organiseren
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="flex gap-4">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                    1
                                </div>
                                <div>
                                    <h3 className="mb-2 font-semibold">
                                        Voeg drankjes toe
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Bouw je database op met verschillende
                                        drankjes die je wilt laten proeven. Voeg
                                        details toe zoals type, merk, herkomst
                                        en alcoholpercentage.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                    2
                                </div>
                                <div>
                                    <h3 className="mb-2 font-semibold">
                                        Organiseer proeverij
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Maak een nieuwe proeverij aan, selecteer
                                        de drankjes en bepaal hoeveel rondes.
                                        Deel de uitnodigingscode met je
                                        vrienden.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                    3
                                </div>
                                <div>
                                    <h3 className="mb-2 font-semibold">
                                        Proef & beoordeel
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Tijdens elke ronde proeven alle
                                        deelnemers hetzelfde drankje en geven
                                        een beoordeling. Aan het einde zie je
                                        welk drankje het populairst was!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Features */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Samen proeven
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span>
                                    Real-time synchronisatie tussen deelnemers
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span>Gelijktijdig proeven en beoordelen</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span>
                                    Uitnodigingscodes voor makkelijk meedoen
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5" />
                                Beoordelen & resultaten
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <span>5-sterren beoordelingssysteem</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <span>Optionele reviews en tags</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <span>Overzichtelijke eindresultaten</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Call to Action */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-8 text-center">
                        <Wine className="mx-auto mb-4 h-12 w-12 text-primary" />
                        <h2 className="mb-2 text-2xl font-bold">
                            Klaar om te beginnen?
                        </h2>
                        <p className="mb-6 text-muted-foreground">
                            Organiseer je eerste borrel proeverij en ontdek
                            welke drankjes het best smaken!
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/tasting/sessions/create">
                                <Button size="lg">
                                    <Plus className="h-4 w-4" />
                                    Start je eerste proeverij
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/tasting/drinks/create">
                                <Button variant="outline" size="lg">
                                    Voeg eerst drankjes toe
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
