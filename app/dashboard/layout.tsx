"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../../lib/auth-context";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    LayoutDashboard, UserCircle, Link as LinkIcon,
    Shield, Users, LogOut, Zap, ChevronDown, Settings
} from "lucide-react";
import { cn } from "../../lib/utils";


const userNavItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "My Profile", icon: UserCircle },
    { href: "/dashboard/links", label: "My Links", icon: LinkIcon },
];

const adminNavItems = [
    { href: "/admin", label: "Admin Overview", icon: Shield },
    { href: "/admin/users", label: "All Users", icon: Users },
];

function NavItem({ href, label, icon: Icon, active }: { href: string; label: string; icon: React.ElementType; active: boolean }) {
    return (
        <Link href={href} className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
            active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
        )}>
            <Icon className="w-4 h-4 shrink-0" />
            {label}
        </Link>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) router.push("/login");
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen bg-background items-center justify-center">
                <Skeleton className="w-8 h-8 rounded-full" />
            </div>
        );
    }
    if (!user) return null;

    const initials = user.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-58 border-r border-border/60 bg-sidebar shrink-0">
                {/* Logo */}
                <div className="flex items-center gap-2.5 px-4 py-5 border-b border-border/40">
                    <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 text-black fill-black" />
                    </div>
                    <span className="text-sm font-bold tracking-tight">Tapyzon</span>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold px-2 mb-2">Dashboard</p>
                    {userNavItems.map((item) => (
                        <NavItem key={item.href} {...item} active={pathname === item.href} />
                    ))}

                    {user.isAdmin && (
                        <>
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold px-2 mt-5 mb-2">Administration</p>
                            {adminNavItems.map((item) => (
                                <NavItem key={item.href} {...item} active={pathname.startsWith(item.href)} />
                            ))}
                        </>
                    )}
                </nav>

                {/* User footer */}
                <div className="p-3 border-t border-border/40">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2.5 px-2 py-2 w-full rounded-lg hover:bg-sidebar-accent/50 transition-colors">
                                <Avatar className="w-7 h-7">
                                    <AvatarImage src={user.photo || undefined} alt={user.fullName} />
                                    <AvatarFallback className="text-xs bg-primary/20 text-primary">{initials}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-left min-w-0">
                                    <p className="text-sm font-medium truncate leading-none">{user.fullName}</p>
                                    <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                                </div>
                                <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/profile"><Settings className="w-4 h-4 mr-2" />Settings</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                                <LogOut className="w-4 h-4 mr-2" />Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
