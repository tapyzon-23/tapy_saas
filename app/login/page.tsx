"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Zap } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setLoading(true);
        try {
            const res = await login(email, password) as unknown as { user: { isAdmin: boolean } };
            if (res?.user?.isAdmin) router.push("/admin");
            else router.push("/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
            {/* Background grid */}
            <div className="absolute inset-0 bg-grid-zinc-900/20 bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-[380px]">
                {/* Brand */}
                <div className="flex flex-col items-center mb-8 gap-2">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                            <Zap className="w-5 h-5 text-black fill-black" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground">Tapyzon</span>
                    </div>
                    <p className="text-xs text-muted-foreground tracking-widest uppercase">Identity Platform</p>
                </div>

                <Card className="border-border/60 shadow-2xl shadow-black/40">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold">Sign in to your account</CardTitle>
                        <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full mt-2" disabled={loading}>
                                {loading ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</>
                                ) : "Sign in"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    © {new Date().getFullYear()} Tapyzon NFC. All rights reserved.
                </p>
            </div>
        </main>
    );
}
