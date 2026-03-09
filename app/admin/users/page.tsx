"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Search, UserPlus } from "lucide-react";

interface User { id: number; username: string; full_name: string; email: string; is_admin: number; status: string; profile_photo: string; }

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        api.admin.listUsers().then((res) => {
            setUsers((res as { users: User[] }).users);
            setLoading(false);
        });
    }, []);

    const filtered = users.filter(u =>
        u.full_name.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">All Users</h1>
                    <p className="text-muted-foreground text-sm mt-1">{users.length} total users registered.</p>
                </div>
                <Button asChild size="sm">
                    <Link href="/admin/users/new"><UserPlus className="w-4 h-4 mr-1.5" />Add User</Link>
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search users..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden lg:table-cell">Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? [...Array(8)].map((_, i) => (
                                <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                            )) : filtered.map((u) => {
                                const initials = u.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
                                return (
                                    <TableRow key={u.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarImage src={u.profile_photo || undefined} />
                                                    <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{u.full_name}</p>
                                                    <p className="text-xs text-muted-foreground">@{u.username}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{u.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={u.status === 'active' ? 'default' : 'destructive'} className="text-xs capitalize">{u.status}</Badge>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {u.is_admin ? <Badge variant="secondary" className="text-xs">Admin</Badge> : <span className="text-xs text-muted-foreground">User</span>}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/admin/users/${u.id}`}>Edit</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {!loading && filtered.length === 0 && (
                                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-10">No users found.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <CardTitle></CardTitle>
                </CardContent>
            </Card>
        </div>
    );
}
