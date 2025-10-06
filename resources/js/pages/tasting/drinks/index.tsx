import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus, Wine } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Drankjes',
        href: '/tasting/drinks',
    },
];

interface Drink {
    id: number;
    name: string;
    description: string | null;
    type: string;
    brand: string | null;
    alcohol_percentage: number | null;
    origin: string | null;
    image_url: string | null;
}

interface Props {
    drinks: {
        data: Drink[];
        links: Record<string, unknown>;
        meta: Record<string, unknown>;
    };
}

export default function DrinksIndex({ drinks }: Props) {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Drankjes" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Drankjes
                        </h1>
                        <p className="text-muted-foreground">
                            Beheer de drankjes voor proeverijen
                        </p>
                    </div>
                    <Link href="/tasting/drinks/create">
                        <Button>
                            <Plus className="h-4 w-4" />
                            Drankje toevoegen
                        </Button>
                    </Link>
                </div>

                {drinks.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Wine className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">
                                Nog geen drankjes
                            </h3>
                            <p className="mb-4 text-center text-muted-foreground">
                                Voeg drankjes toe om ze te kunnen gebruiken in
                                proeverijen
                            </p>
                            <Link href="/tasting/drinks/create">
                                <Button>
                                    <Plus className="h-4 w-4" />
                                    Eerste drankje toevoegen
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {drinks.data.map((drink) => (
                            <Card
                                key={drink.id}
                                className="transition-shadow hover:shadow-md"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-base">
                                                <Link
                                                    href={`/tasting/drinks/${drink.id}`}
                                                    className="hover:underline"
                                                >
                                                    {drink.name}
                                                </Link>
                                            </CardTitle>
                                            <div className="mt-2 flex gap-2">
                                                <span className="rounded bg-muted px-2 py-1 text-xs">
                                                    {getTypeDisplay(drink.type)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-2 text-sm">
                                        {drink.brand && (
                                            <p>
                                                <span className="text-muted-foreground">
                                                    Merk:
                                                </span>{' '}
                                                {drink.brand}
                                            </p>
                                        )}
                                        {drink.origin && (
                                            <p>
                                                <span className="text-muted-foreground">
                                                    Herkomst:
                                                </span>{' '}
                                                {drink.origin}
                                            </p>
                                        )}
                                        {drink.alcohol_percentage && (
                                            <p>
                                                <span className="text-muted-foreground">
                                                    Alcohol:
                                                </span>{' '}
                                                {drink.alcohol_percentage}%
                                            </p>
                                        )}
                                        {drink.description && (
                                            <p className="line-clamp-2 text-xs text-muted-foreground">
                                                {drink.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <Link
                                            href={`/tasting/drinks/${drink.id}`}
                                            className="flex-1"
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                            >
                                                Bekijken
                                            </Button>
                                        </Link>
                                        <Link
                                            href={`/tasting/drinks/${drink.id}/edit`}
                                        >
                                            <Button size="sm">Bewerken</Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
