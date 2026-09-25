import { auth } from "@/auth";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function ToolPage({
                                           params
                                       }: {
    params: Promise<{ toolName: string }>
}) {
    const session = await auth();
    if (!session?.user?.organizationId) redirect("/login");

    // En Next.js 15 los params deben resolverse con await
    const resolvedParams = await params;
    const toolName = resolvedParams.toolName;

    const orgRecord = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, session.user.organizationId))
        .limit(1);

    if (!orgRecord.length) {
        return <div>Error: Organización no encontrada</div>;
    }

    const orgSlug = orgRecord[0].name.toLowerCase().replace(/\s+/g, '-');

    // Construimos la URL pública hacia el archivo HTML
    const toolUrl = `/orgs/${orgSlug}/tools/${toolName}.html`;

    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-zinc-200 shadow-sm bg-white">
            <iframe
                src={toolUrl}
                className="w-full h-full border-none"
                title={toolName.replace(/_/g, ' ')}
            />
        </div>
    );
}