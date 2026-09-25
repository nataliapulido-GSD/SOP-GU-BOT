"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Credenciales inválidas. Por favor, intenta de nuevo.");
            setLoading(false);
        } else {
            router.push("/chat");
            router.refresh();
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50/50 p-4 sm:p-8">

            {/* Contenedor principal con ancho máximo */}
            <div className="w-full max-w-[420px] space-y-8">

                {/* Encabezado fuera de la tarjeta para darle más aire */}
                <div className="flex flex-col items-center text-center space-y-6">
                    <img
                        src="https://www.gsdoutsource.com/assets/logos/gsdnewLogo.png"
                        alt="GSD Associates"
                        className="h-14 md:h-16 object-contain drop-shadow-sm"
                    />
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                            Bienvenido a Max
                        </h1>
                        <p className="text-sm text-zinc-500 max-w-[320px] mx-auto leading-relaxed">
                            Tu asistente inteligente para la gestión de SOPs, guías interactivas y recursos operativos.
                        </p>
                    </div>
                </div>

                {/* Tarjeta de Login */}
                <Card className="shadow-xl shadow-zinc-200/50 border-zinc-200/60">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2 text-violet-600 font-medium text-sm">
                            <Sparkles className="h-4 w-4" />
                            <span>Iniciar Sesión</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2.5">
                                <Label htmlFor="email" className="text-zinc-700 font-medium">
                                    Correo Electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@gsdoutsource.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11 focus-visible:ring-violet-600 bg-zinc-50/50"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="password" className="text-zinc-700 font-medium">
                                    Contraseña
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-11 focus-visible:ring-violet-600 bg-zinc-50/50"
                                />
                            </div>

                            {error && (
                                <div className="p-3 rounded-md bg-red-50 border border-red-100">
                                    <p className="text-sm text-red-600 text-center font-medium">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-md hover:shadow-lg mt-2"
                                disabled={loading}
                            >
                                {loading ? "Verificando credenciales..." : "Acceder a la plataforma"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer pequeño */}
                <p className="text-center text-xs text-zinc-400">
                    © {new Date().getFullYear()} GSD Associates. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
}