import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Wine } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Drankjes',
        href: '/tasting/drinks',
    },
    {
        title: 'Drankje',
        href: '#',
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
    drink: Drink;
}

export default function ShowDrink({ drink }: Props) {
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
            <Head title={drink.name} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center gap-4">
                    <Link href="/tasting/drinks">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                            Terug
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {drink.name}
                        </h1>
                        <p className="text-muted-foreground">Drankje details</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/tasting/drinks/${drink.id}/edit`}>
                            <Button variant="outline">
                                <Edit className="h-4 w-4" />
                                Bewerken
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wine className="h-5 w-5" />
                                {drink.name}
                            </CardTitle>
                            <div className="flex gap-2">
                                <span className="rounded bg-muted px-2 py-1 text-sm">
                                    {getTypeDisplay(drink.type)}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {drink.description && (
                                <div>
                                    <h3 className="mb-2 font-medium">
                                        Beschrijving
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {drink.description}
                                    </p>
                                </div>
                            )}

                            <div className="grid gap-4 md:grid-cols-2">
                                {drink.brand && (
                                    <div>
                                        <h3 className="mb-1 font-medium">
                                            Merk
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {drink.brand}
                                        </p>
                                    </div>
                                )}

                                {drink.origin && (
                                    <div>
                                        <h3 className="mb-1 font-medium">
                                            Herkomst
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {drink.origin}
                                        </p>
                                    </div>
                                )}

                                {drink.alcohol_percentage && (
                                    <div>
                                        <h3 className="mb-1 font-medium">
                                            Alcoholpercentage
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {drink.alcohol_percentage}%
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <h3 className="mb-1 font-medium">Type</h3>
                                    <p className="text-muted-foreground">
                                        {getTypeDisplay(drink.type)}
                                    </p>
                                </div>
                            </div>

                            {drink.image_url && (
                                <div>
                                    <h3 className="mb-2 font-medium">
                                        Afbeelding
                                    </h3>
                                    <img
                                        src={drink.image_url}
                                        alt={drink.name}
                                        className="max-w-xs rounded-lg border"
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                'none';
                                        }}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
