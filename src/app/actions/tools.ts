"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

export async function getOrganizationTools() {
    const session = await auth();
    if (!session?.user?.organizationId) return { tools: [], pdfs: [], orgSlug: "", orgName: "" };

    const orgRecord = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, session.user.organizationId))
        .limit(1);

    if (!orgRecord.length) return { tools: [], pdfs: [], orgSlug: "", orgName: "" };

    const orgName = orgRecord[0].name;
    const orgSlug = orgName.toLowerCase().replace(/\s+/g, '-');

    try {
        const toolsDir = path.join(process.cwd(), 'public', 'orgs', orgSlug, 'tools');

        if (!fs.existsSync(toolsDir)) {
            return { tools: [], pdfs: [], orgSlug, orgName };
        }

        const files = fs.readdirSync(toolsDir);

        // Filtramos HTMLs
        const htmlFiles = files
            .filter(f => f.endsWith('.html'))
            .map(f => f.replace('.html', ''));

        // Filtramos PDFs
        const pdfFiles = files
            .filter(f => f.endsWith('.pdf'))
            .map(f => f.replace('.pdf', ''));

        return { tools: htmlFiles, pdfs: pdfFiles, orgSlug, orgName };
    } catch (error) {
        console.error("Error leyendo el directorio de tools:", error);
        return { tools: [], pdfs: [], orgSlug, orgName };
    }
}