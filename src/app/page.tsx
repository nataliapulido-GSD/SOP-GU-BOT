import { redirect } from "next/navigation";

export default function HomePage() {
    // Si el usuario llega a este punto, significa que el middleware validó que SÍ tiene sesión.
    // Por lo tanto, lo redirigimos directamente a su panel principal (el chat).
    redirect("/chat");
}