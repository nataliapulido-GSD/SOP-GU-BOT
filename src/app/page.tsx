import Link from "next/link";

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50">
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                    SOP GU BOT
                </h1>
                <p className="text-lg text-zinc-600">
                    Sistema Multi-tenant de Chat y Herramientas
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        href="/login"
                        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-900/90"
                    >
                        Iniciar Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}