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
        title: 'Nieuw drankje',
        href: '/tasting/drinks/create',
    },
];

export default function CreateDrink() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        type: 'beer',
        brand: '',
        alcohol_percentage: '',
        origin: '',
        image_url: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tasting/drinks');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nieuw drankje" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center gap-4">
                    <Link href="/tasting/drinks">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                            Terug
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Nieuw drankje
                        </h1>
                        <p className="text-muted-foreground">
                            Voeg een drankje toe aan de database
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wine className="h-5 w-5" />
                                Drankje details
                            </CardTitle>
                            <CardDescription>
                                Vul de gegevens van het drankje in
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Naam *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Bijv. Heineken"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className={
                                                errors.name
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type *</Label>
                                        <Select
                                            value={data.type}
                                            onValueChange={(value) =>
                                                setData('type', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="beer">
                                                    Bier
                                                </SelectItem>
                                                <SelectItem value="wine">
                                                    Wijn
                                                </SelectItem>
                                                <SelectItem value="spirits">
                                                    Sterke drank
                                                </SelectItem>
                                                <SelectItem value="cocktail">
                                                    Cocktail
                                                </SelectItem>
                                                <SelectItem value="other">
                                                    Anders
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && (
                                            <p className="text-sm text-red-500">
                                                {errors.type}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Beschrijving
                                    </Label>
                                    <Input
                                        id="description"
                                        type="text"
                                        placeholder="Optionele beschrijving van het drankje..."
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="brand">Merk</Label>
                                        <Input
                                            id="brand"
                                            type="text"
                                            placeholder="Bijv. Heineken"
                                            value={data.brand}
                                            onChange={(e) =>
                                                setData('brand', e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="origin">Herkomst</Label>
                                        <Input
                                            id="origin"
                                            type="text"
                                            placeholder="Bijv. Nederland"
                                            value={data.origin}
                                            onChange={(e) =>
                                                setData(
                                                    'origin',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="alcohol_percentage">
                                            Alcoholpercentage (%)
                                        </Label>
                                        <Input
                                            id="alcohol_percentage"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            placeholder="Bijv. 5.0"
                                            value={data.alcohol_percentage}
                                            onChange={(e) =>
                                                setData(
                                                    'alcohol_percentage',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.alcohol_percentage && (
                                            <p className="text-sm text-red-500">
                                                {errors.alcohol_percentage}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="image_url">
                                            Afbeelding URL
                                        </Label>
                                        <Input
                                            id="image_url"
                                            type="url"
                                            placeholder="https://example.com/image.jpg"
                                            value={data.image_url}
                                            onChange={(e) =>
                                                setData(
                                                    'image_url',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.image_url && (
                                            <p className="text-sm text-red-500">
                                                {errors.image_url}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Link href="/tasting/drinks">
                                        <Button variant="outline" type="button">
                                            Annuleren
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Bezig...'
                                            : 'Drankje toevoegen'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
