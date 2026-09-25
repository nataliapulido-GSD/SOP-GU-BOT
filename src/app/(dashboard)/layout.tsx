import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { getOrganizationTools } from "@/app/actions/tools";

export default async function DashboardLayout({
                                                  children,
                                              }: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const { tools, pdfs, orgSlug, orgName } = await getOrganizationTools();

    return (
        <div className="flex h-screen w-full overflow-hidden bg-zinc-50">
            <Sidebar tools={tools} pdfs={pdfs} orgSlug={orgSlug} orgName={orgName} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header user={session.user} tools={tools} pdfs={pdfs} orgSlug={orgSlug} orgName={orgName} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}