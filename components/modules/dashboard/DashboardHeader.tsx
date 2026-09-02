"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, LogOut, User } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { ModeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function DashboardHeader({ title }: { title?: string }) {
    const router = useRouter()
    const { user, logout, isLoggingOut } = useAuth()

    const handleLogout = async () => {
        await logout()
        router.push("/login")
        router.refresh()
    }

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-4" />
                {title && <h1 className="text-sm font-medium">{title}</h1>}
            </div>
            <div className="flex items-center gap-5">
                <ModeToggle />
                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="hidden h-10 w-10 rounded-full transition hover:opacity-80 md:flex">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                                    <AvatarFallback className="bg-zinc-800 text-sm font-bold text-white">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="font-normal">
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild>
                                <Link href="/myProfile" className="flex cursor-pointer items-center gap-2">
                                    <User className="h-4 w-4" />
                                    My Profile
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/dashboard" className="flex cursor-pointer items-center gap-2">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="flex cursor-pointer items-center gap-2 text-red-500 focus:text-red-500"
                            >
                                <LogOut className="h-4 w-4" />
                                {isLoggingOut ? "Logging out…" : "Log out"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    )
}