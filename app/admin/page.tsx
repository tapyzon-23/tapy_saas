"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Users, MousePointerClick, UserCheck, TrendingUp, UserPlus } from "lucide-react";

interface Stats { total: number; active: number; taps: number; weekTaps: number; }
interface User { id: number; username: string; full_name: string; email: string; is_admin: number; status: string; profile_photo: string; }

export default function AdminPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const [s, u] = await Promise.all([
                api.admin.getStats() as Promise<{ total: number; active: number; taps: number; weekTaps: number }>,
                api.admin.listUsers() as Promise<{ users: User[] }>,
            ]);
            setStats(s);
            setUsers(u.users.slice(0, 10));
            setLoading(false);
        };
        load();
    }, []);

    const statCards = [
        { label: "Total Users", value: stats?.total, icon: Users, color: "text-blue-400" },
        { label: "Active Users", value: stats?.active, icon: UserCheck, color: "text-emerald-400" },
        { label: "Total Taps", value: stats?.taps, icon: MousePointerClick, color: "text-primary" },
        { label: "This Week", value: stats?.weekTaps, icon: TrendingUp, color: "text-violet-400" },
    ];

    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage users and view platform analytics.</p>
                </div>
                <Button asChild size="sm">
                    <Link href="/admin/users/new"><UserPlus className="w-4 h-4 mr-1.5" />Add User</Link>
                </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(({ label, value, icon: Icon, color }) => (
                    <Card key={label}>
                        <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                            <Icon className={`w-4 h-4 ${color}`} />
                        </CardHeader>
                        <CardContent>
                            {loading ? <Skeleton className="h-8 w-16" /> : (
                                <p className="text-3xl font-bold tabular-nums">{value ?? "—"}</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader className="flex-row items-center justify-between pb-4">
                    <CardTitle className="text-base font-semibold">Recent Users</CardTitle>
                    <Button asChild variant="ghost" size="sm" className="text-xs">
                        <Link href="/admin/users">View all →</Link>
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? [...Array(5)].map((_, i) => (
                                <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                            )) : users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium">
                                        <div>
                                            <p className="text-sm font-medium">{u.full_name}</p>
                                            <p className="text-xs text-muted-foreground">@{u.username}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{u.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={u.status === 'active' ? 'default' : 'destructive'} className="text-xs capitalize">
                                            {u.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {u.is_admin ? <Badge variant="secondary" className="text-xs">Admin</Badge> : <span className="text-xs text-muted-foreground">User</span>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/admin/users/${u.id}`}>Edit</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
