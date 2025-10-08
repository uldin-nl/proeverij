import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Landing() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Proeverij" />

            <div className="min-h-screen bg-background text-foreground">
                <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-2">
                        <img src="/logo.svg" alt="Proeverij" className="h-6 w-6" />
                        <span className="text-sm font-medium tracking-tight">Proeverij</span>
                    </div>

                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-1.5 text-sm text-primary-foreground hover:opacity-90"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href={login()}
                                    className="rounded-md px-3 py-1.5 text-sm hover:underline underline-offset-4"
                                >
                                    Inloggen
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-flex items-center rounded-md border border-border bg-card px-4 py-1.5 text-sm text-foreground shadow-sm hover:opacity-90"
                                >
                                    Registreren
                                </Link>
                            </div>
                        )}
                    </nav>
                </header>

                <main className="mx-auto max-w-6xl px-6">
                    {/* Hero */}
                    <section className="relative isolate overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] lg:px-16 lg:py-24">
                        <div className="grid items-center gap-10 lg:grid-cols-2">
                            <div>
                                <h1 className="text-balance text-3xl font-semibold tracking-tight lg:text-5xl">
                                    Samen blind proeven. Eerlijk. Leuk. Gebruiksvriendelijk.
                                </h1>
                                <p className="mt-4 max-w-prose text-sm leading-6 text-muted-foreground">
                                    Organiseer proeverijen, beheer rondes en verzamel beoordelingen met gemak. Proeverij
                                    maakt blind proeven modern en overzichtelijk – voor vrienden, wijnclubs en bedrijven.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    {auth.user ? (
                                        <Link
                                            href={dashboard()}
                                            className="inline-flex items-center rounded-md border border-transparent bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                                        >
                                            Naar dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={register()}
                                                className="inline-flex items-center rounded-md border border-transparent bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                                            >
                                                Aan de slag
                                            </Link>
                                            <Link
                                                href={login()}
                                                className="inline-flex items-center rounded-md border border-border bg-card px-5 py-2 text-sm font-medium text-foreground hover:opacity-90"
                                            >
                                                Inloggen
                                            </Link>
                                        </>
                                    )}
                                </div>
                                <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-foreground">★</span>
                                        <span>Realtime rondestatus en live resultaten</span>
                                    </div>
                                    <div className="hidden items-center gap-2 sm:flex">
                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-foreground">✓</span>
                                        <span>Eenvoudig delen met deelnemers</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-[#1F1F1C] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]">
                                    <div className="flex h-full w-full items-center justify-center">
                                        <img src="/logo.svg" alt="Proeverij" className="h-full w-full opacity-90" />
                                    </div>
                                </div>
                                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5 dark:ring-white/10" />
                            </div>
                        </div>

                        <div className="pointer-events-none absolute inset-0 -z-10">
                            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
                            <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
                        </div>
                    </section>

                    {/* Features */}
                    <section className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
                        {[
                            {
                                title: 'Rondes & deelnemers',
                                desc: 'Maak rondes aan, nodig deelnemers uit en volg de status live.',
                            },
                            {
                                title: 'Blind beoordelen',
                                desc: 'Verzamel eerlijke feedback per drankje met consistente criteria.',
                            },
                            {
                                title: 'Realtime updates',
                                desc: 'Zie inzendingen en voortgang zonder te verversen dankzij websockets.',
                            },
                            {
                                title: 'Resultaten & inzichten',
                                desc: 'Bekijk gemiddelde scores, notities en winnaars per sessie.',
                            },
                            { title: 'Mooi in dark mode', desc: 'Automatische thema-detectie en pixel-perfect in het donker.' },
                            {
                                title: 'Snel en modern',
                                desc: 'Gebouwd met Laravel, Inertia en React voor een vloeiende UX.',
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-foreground">★</div>
                                <h3 className="text-base font-medium">{item.title}</h3>
                                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </section>

                    {/* CTA */}
                    <section className="mx-auto mt-16 max-w-6xl rounded-2xl border border-border bg-gradient-to-b from-card to-secondary p-6 text-center shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] lg:p-12">
                        <h2 className="text-balance text-2xl font-semibold tracking-tight lg:text-3xl">
                            Klaar om je eerste proeverij te starten?
                        </h2>
                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Maak een sessie, voeg drankjes toe en nodig vrienden of collega’s uit. Alles in één plek.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center rounded-md border border-transparent bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                                >
                                    Open dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center rounded-md border border-transparent bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                                    >
                                        Maak gratis account
                                    </Link>
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center rounded-md border border-border bg-card px-5 py-2 text-sm font-medium text-foreground hover:opacity-90"
                                    >
                                        Al een account? Inloggen
                                    </Link>
                                </>
                            )}
                        </div>
                    </section>

                    <footer className="mx-auto my-10 flex max-w-6xl items-center justify-between px-1 text-xs text-muted-foreground">
                        <span>© {new Date().getFullYear()} Proeverij</span>
                        <div className="flex items-center gap-4">
                            <a href="#" className="hover:underline">
                                Privacy
                            </a>
                            <a href="#" className="hover:underline">
                                Voorwaarden
                            </a>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
}


