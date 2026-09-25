"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, MessageSquare, Building2, BookOpen } from "lucide-react";

interface SidebarProps {
    tools: string[];
    pdfs: string[];
    orgSlug: string;
    orgName: string;
}

export default function Sidebar({ tools, pdfs, orgSlug, orgName }: SidebarProps) {
    const pathname = usePathname();

    const formatToolName = (name: string) => {
        return name.replace(/_/g, ' ');
    };

    return (
        <div className="hidden md:flex w-64 flex-col bg-zinc-900 text-zinc-50 h-full">
            <div className="p-5 border-b border-zinc-800">
                <h2 className="text-lg font-bold tracking-tight text-white">GSD Associates</h2>
                <div className="flex items-center gap-1.5 mt-2 text-violet-400">
                    <Building2 className="h-3.5 w-3.5" />
                    <p className="text-xs font-medium uppercase tracking-wider">{orgName}</p>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                    <div>
                        <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Principal
                        </h3>
                        <div className="space-y-1">
                            <Link
                                href="/chat"
                                className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                                    pathname === '/chat'
                                        ? 'bg-violet-600 text-white'
                                        : 'hover:bg-zinc-800 hover:text-zinc-50'
                                }`}
                            >
                                <MessageSquare className="h-4 w-4" />
                                Chat Asistente
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Guías Interactivas
                        </h3>
                        <div className="space-y-1">
                            {tools.length === 0 ? (
                                <p className="px-2 text-xs text-zinc-500">No hay guías disponibles.</p>
                            ) : (
                                tools.map((tool) => {
                                    const toolPath = `/tools/${tool}`;
                                    const isActive = pathname === toolPath;

                                    return (
                                        <Link
                                            key={tool}
                                            href={toolPath}
                                            className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                                                isActive
                                                    ? 'bg-zinc-800 text-violet-400'
                                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50'
                                            }`}
                                        >
                                            <FileText className="h-4 w-4 flex-shrink-0" />
                                            <span className="truncate" title={formatToolName(tool)}>
                        {formatToolName(tool)}
                      </span>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            PDF Resources
                        </h3>
                        <div className="space-y-1">
                            {pdfs.length === 0 ? (
                                <p className="px-2 text-xs text-zinc-500">No hay PDFs disponibles.</p>
                            ) : (
                                pdfs.map((pdf) => {
                                    const pdfPath = `/resources/${pdf}`;
                                    const isActive = pathname === pdfPath;

                                    return (
                                        <Link
                                            key={pdf}
                                            href={pdfPath}
                                            className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                                                isActive
                                                    ? 'bg-zinc-800 text-violet-400'
                                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50'
                                            }`}
                                        >
                                            <BookOpen className="h-4 w-4 flex-shrink-0" />
                                            <span className="truncate" title={formatToolName(pdf)}>
                        {formatToolName(pdf)}
                      </span>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}