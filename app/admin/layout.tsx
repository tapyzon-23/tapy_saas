"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../../lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Shield, Users, LayoutDashboard, LogOut, Zap, ChevronDown, ArrowLeft } from "lucide-react";
import { cn } from "../../lib/utils";


const adminNavItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/users", label: "Users", icon: Users, exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && (!user || !user.isAdmin)) router.push("/dashboard");
    }, [user, loading, router]);

    if (loading) return (
        <div className="flex h-screen bg-background items-center justify-center">
            <Skeleton className="w-8 h-8 rounded-full" />
        </div>
    );
    if (!user?.isAdmin) return null;

    const initials = user.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <aside className="hidden lg:flex flex-col w-56 border-r border-border/60 bg-sidebar shrink-0">
                <div className="flex items-center gap-2.5 px-4 py-5 border-b border-border/40">
                    <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 text-black fill-black" />
                    </div>
                    <div>
                        <span className="text-sm font-bold tracking-tight">Tapyzon</span>
                        <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-primary" />
                            <span className="text-[10px] text-primary font-semibold tracking-wider uppercase">Admin</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {adminNavItems.map((item) => (
                        <Link key={item.href} href={item.href} className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                            (item.exact ? pathname === item.href : pathname.startsWith(item.href))
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                        )}>
                            <item.icon className="w-4 h-4 shrink-0" />{item.label}
                        </Link>
                    ))}

                    <div className="pt-4 mt-4 border-t border-border/30">
                        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all duration-150">
                            <ArrowLeft className="w-4 h-4 shrink-0" />My Dashboard
                        </Link>
                    </div>
                </nav>

                <div className="p-3 border-t border-border/40">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2.5 px-2 py-2 w-full rounded-lg hover:bg-sidebar-accent/50 transition-colors">
                                <Avatar className="w-7 h-7">
                                    <AvatarImage src={user.photo || undefined} />
                                    <AvatarFallback className="text-xs bg-primary/20 text-primary">{initials}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-left min-w-0">
                                    <p className="text-sm font-medium truncate leading-none">{user.fullName}</p>
                                    <p className="text-xs text-muted-foreground truncate mt-0.5">Administrator</p>
                                </div>
                                <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                                <LogOut className="w-4 h-4 mr-2" />Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    );
}
