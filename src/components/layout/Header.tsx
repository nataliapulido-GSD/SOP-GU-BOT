"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import { handleSignOut } from "@/app/actions/auth";

interface HeaderProps {
    user: {
        name?: string | null;
        email?: string | null;
        role?: string;
    };
    tools: string[];
    pdfs: string[];
    orgSlug: string;
    orgName: string;
}

export default function Header({ user, tools, pdfs, orgSlug, orgName }: HeaderProps) {
    const initials = user?.name?.substring(0, 2).toUpperCase() || "US";

    return (
        <header className="flex h-14 items-center justify-between border-b bg-white px-4 lg:px-6">
            <div className="flex items-center gap-3 md:gap-4">
                <Sheet>
                    <SheetTrigger className="inline-flex items-center justify-center rounded-md p-2 text-zinc-900 hover:bg-zinc-100 md:hidden focus:outline-none focus:ring-2 focus:ring-zinc-900">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64 bg-zinc-900 border-r-zinc-800">
                        <Sidebar tools={tools} pdfs={pdfs} orgSlug={orgSlug} orgName={orgName} />
                    </SheetContent>
                </Sheet>

                {/* Logo de GSD Associates */}
                <img
                    src="https://www.gsdoutsource.com/assets/logos/gsdnewLogo.png"
                    alt="GSD Associates"
                    className="h-6 md:h-7 object-contain"
                />
            </div>

            <div className="flex flex-1 items-center justify-end gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger className="relative h-8 w-8 rounded-full outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-violet-600 text-white">{initials}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.email}
                                    </p>
                                    <p className="text-[10px] font-bold text-violet-600 mt-1 uppercase tracking-wider">
                                        Rol: {user.role}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleSignOut()}
                                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 flex items-center gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                Cerrar Sesión
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}