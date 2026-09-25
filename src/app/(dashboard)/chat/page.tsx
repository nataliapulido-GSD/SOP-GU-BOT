import { auth } from "@/auth";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default async function ChatPage() {
    const session = await auth();

    if (!session?.user?.organizationId) {
        redirect("/login");
    }

    // Buscar la organización del usuario en la base de datos
    const orgRecord = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, session.user.organizationId))
        .limit(1);

    const organization = orgRecord[0];

    if (!organization) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-red-500">Error: Organización no encontrada.</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full rounded-lg overflow-hidden border border-zinc-200 shadow-sm">
            {/* Pasamos la URL de la API de la organización al componente cliente */}
            <ChatInterface apiUrl={organization.apiUrl} />
        </div>
    );
}