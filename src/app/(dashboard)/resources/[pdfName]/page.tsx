import { auth } from "@/auth";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function PdfResourcePage({
                                                  params
                                              }: {
    params: Promise<{ pdfName: string }>
}) {
    const session = await auth();
    if (!session?.user?.organizationId) redirect("/login");

    const resolvedParams = await params;
    const pdfName = resolvedParams.pdfName;

    const orgRecord = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, session.user.organizationId))
        .limit(1);

    if (!orgRecord.length) {
        return <div>Error: Organización no encontrada</div>;
    }

    const orgSlug = orgRecord[0].name.toLowerCase().replace(/\s+/g, '-');

    // Construimos la URL pública hacia el archivo PDF
    const pdfUrl = `/orgs/${orgSlug}/tools/${pdfName}.pdf`;

    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-zinc-200 shadow-sm bg-white flex flex-col">
            <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-800">
                    {pdfName.replace(/_/g, ' ')}
                </h2>
                <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-violet-600 hover:text-violet-700 bg-violet-50 px-3 py-1.5 rounded-md transition-colors"
                >
                    Abrir en nueva pestaña
                </a>
            </div>
            <iframe
                src={`${pdfUrl}#toolbar=0`}
                className="w-full flex-1 border-none"
                title={pdfName.replace(/_/g, ' ')}
            />
        </div>
    );
}