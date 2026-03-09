"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MousePointerClick, Link as LinkIcon, ExternalLink, UserCircle } from "lucide-react";

interface DashboardData {
    links: { id: number; title: string; url: string; is_active: number }[];
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.user.getLinks() as { links: DashboardData['links'] };
                setData({ links: res.links });
            } catch { /* ignore */ } finally { setLoading(false); }
        };
        load();
    }, []);

    const activeLinks = data?.links.filter(l => l.is_active) ?? [];

    return (
        <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Welcome back, {user?.fullName.split(" ")[0]} 👋
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Your identity profile is live at{" "}
                        <a href={`http://localhost:3000/${user?.username}`} target="_blank" rel="noreferrer"
                            className="text-primary underline underline-offset-4 font-medium inline-flex items-center gap-1">
                            tapyzon.top/{user?.username} <ExternalLink className="w-3 h-3" />
                        </a>
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/dashboard/profile"><UserCircle className="w-4 h-4 mr-1.5" />Edit Profile</Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link href="/dashboard/links"><LinkIcon className="w-4 h-4 mr-1.5" />Manage Links</Link>
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <MousePointerClick className="w-4 h-4" />Total Taps
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold tabular-nums">—</p>
                        <p className="text-xs text-muted-foreground mt-0.5">All-time tap count</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" />Active Links
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-8 w-12" /> : (
                            <p className="text-3xl font-bold tabular-nums">{activeLinks.length}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5">Published links</p>
                    </CardContent>
                </Card>
            </div>

            {/* Links Quick View */}
            <Card>
                <CardHeader className="flex-row items-center justify-between pb-4">
                    <CardTitle className="text-base font-semibold">Your Links</CardTitle>
                    <Button asChild variant="ghost" size="sm" className="text-xs">
                        <Link href="/dashboard/links">Manage all →</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}</div>
                    ) : data?.links.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <LinkIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No links yet. <Link href="/dashboard/links" className="text-primary underline">Add your first link.</Link></p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {data?.links.slice(0, 5).map((link) => (
                                <div key={link.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-border/50 hover:border-border transition-colors">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">{link.title}</p>
                                        <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                                    </div>
                                    <Badge variant={link.is_active ? "default" : "secondary"} className="text-xs shrink-0 ml-3">
                                        {link.is_active ? "Active" : "Hidden"}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
