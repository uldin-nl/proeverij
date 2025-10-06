import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Wine } from 'lucide-react';
import { useState } from 'react';

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
        title: 'Nieuwe proeverij',
        href: '/tasting/sessions/create',
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
    drinks: Drink[];
}

export default function CreateSession({ drinks }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        max_rounds: 5,
        drink_ids: [] as number[],
    });

    const [selectedDrinks, setSelectedDrinks] = useState<number[]>([]);

    const handleDrinkToggle = (drinkId: number) => {
        const newSelection = selectedDrinks.includes(drinkId)
            ? selectedDrinks.filter((id) => id !== drinkId)
            : [...selectedDrinks, drinkId];

        setSelectedDrinks(newSelection);
        setData('drink_ids', newSelection);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tasting/sessions');
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nieuwe proeverij" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center gap-4">
                    <Link href="/tasting/sessions">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                            Terug
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Nieuwe proeverij
                        </h1>
                        <p className="text-muted-foreground">
                            Organiseer een borrel proeverij met vrienden
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Session Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Proeverij details</CardTitle>
                                <CardDescription>
                                    Geef je proeverij een naam en beschrijving
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Naam *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Bijv. Bier proeverij vrijdagavond"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className={
                                            errors.name ? 'border-red-500' : ''
                                        }
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Beschrijving
                                    </Label>
                                    <Input
                                        id="description"
                                        type="text"
                                        placeholder="Optionele beschrijving..."
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="max_rounds">
                                        Aantal rondes *
                                    </Label>
                                    <Select
                                        value={data.max_rounds.toString()}
                                        onValueChange={(value) =>
                                            setData(
                                                'max_rounds',
                                                parseInt(value),
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[
                                                1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                                            ].map((num) => (
                                                <SelectItem
                                                    key={num}
                                                    value={num.toString()}
                                                >
                                                    {num}{' '}
                                                    {num === 1
                                                        ? 'ronde'
                                                        : 'rondes'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Selection Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Geselecteerde drankjes</CardTitle>
                                <CardDescription>
                                    {selectedDrinks.length} van max{' '}
                                    {data.max_rounds} drankjes geselecteerd
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {selectedDrinks.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <Wine className="mb-2 h-8 w-8 text-muted-foreground" />
                                        <p className="text-muted-foreground">
                                            Geen drankjes geselecteerd
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {selectedDrinks
                                            .slice(0, data.max_rounds)
                                            .map((drinkId, index) => {
                                                const drink = drinks.find(
                                                    (d) => d.id === drinkId,
                                                );
                                                return drink ? (
                                                    <div
                                                        key={drinkId}
                                                        className="flex items-center justify-between rounded-md bg-muted p-2"
                                                    >
                                                        <div>
                                                            <span className="font-medium">
                                                                Ronde{' '}
                                                                {index + 1}:
                                                            </span>
                                                            <span className="ml-2">
                                                                {drink.name}
                                                            </span>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDrinkToggle(
                                                                    drinkId,
                                                                )
                                                            }
                                                        >
                                                            ✕
                                                        </Button>
                                                    </div>
                                                ) : null;
                                            })}
                                    </div>
                                )}
                                {errors.drink_ids && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.drink_ids}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Drinks Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Selecteer drankjes</CardTitle>
                            <CardDescription>
                                Kies de drankjes die tijdens de proeverij
                                geproefd worden. Je kunt maximaal{' '}
                                {data.max_rounds} drankjes selecteren.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {drinks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Wine className="mb-4 h-12 w-12 text-muted-foreground" />
                                    <h3 className="mb-2 text-lg font-medium">
                                        Geen drankjes beschikbaar
                                    </h3>
                                    <p className="mb-4 text-muted-foreground">
                                        Er zijn nog geen drankjes toegevoegd aan
                                        het systeem
                                    </p>
                                    <Link href="/tasting/drinks/create">
                                        <Button>Drankje toevoegen</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {drinks.map((drink) => (
                                        <div
                                            key={drink.id}
                                            className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                                                selectedDrinks.includes(
                                                    drink.id,
                                                )
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                            } ${
                                                selectedDrinks.length >=
                                                    data.max_rounds &&
                                                !selectedDrinks.includes(
                                                    drink.id,
                                                )
                                                    ? 'cursor-not-allowed opacity-50'
                                                    : ''
                                            }`}
                                            onClick={() => {
                                                if (
                                                    selectedDrinks.length <
                                                        data.max_rounds ||
                                                    selectedDrinks.includes(
                                                        drink.id,
                                                    )
                                                ) {
                                                    handleDrinkToggle(drink.id);
                                                }
                                            }}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <Checkbox
                                                            checked={selectedDrinks.includes(
                                                                drink.id,
                                                            )}
                                                            onChange={() => {}}
                                                        />
                                                        <h3 className="font-medium">
                                                            {drink.name}
                                                        </h3>
                                                    </div>

                                                    <div className="space-y-1 text-sm text-muted-foreground">
                                                        <div className="flex gap-2">
                                                            <span className="rounded bg-muted px-2 py-1 text-xs">
                                                                {getTypeDisplay(
                                                                    drink.type,
                                                                )}
                                                            </span>
                                                        </div>
                                                        {drink.brand && (
                                                            <p>
                                                                Merk:{' '}
                                                                {drink.brand}
                                                            </p>
                                                        )}
                                                        {drink.origin && (
                                                            <p>
                                                                Herkomst:{' '}
                                                                {drink.origin}
                                                            </p>
                                                        )}
                                                        {drink.alcohol_percentage && (
                                                            <p>
                                                                Alcohol:{' '}
                                                                {
                                                                    drink.alcohol_percentage
                                                                }
                                                                %
                                                            </p>
                                                        )}
                                                        {drink.description && (
                                                            <p className="text-xs">
                                                                {
                                                                    drink.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <Link href="/tasting/sessions">
                            <Button variant="outline" type="button">
                                Annuleren
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing || selectedDrinks.length === 0}
                        >
                            {processing ? 'Bezig...' : 'Proeverij aanmaken'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
