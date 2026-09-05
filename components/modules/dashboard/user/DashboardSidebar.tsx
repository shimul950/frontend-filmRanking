"use client"

import {
    LayoutDashboard,
    Star,
    Bookmark,
    MessageSquare,
    User,
    KeyRound,
    CreditCard,
    ShieldCheck,
    Film,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"

const mainNav = [
    { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
    { title: "My Reviews", url: "/dashboard/reviews", icon: Star },
    { title: "Watchlist", url: "/dashboard/watchlist", icon: Bookmark },
    { title: "My Comments", url: "/dashboard/comments", icon: MessageSquare },
]

const accountNav = [
    { title: "My Profile", url: "/myProfile", icon: User },
    { title: "Change Password", url: "/change-password", icon: KeyRound },
    { title: "Billing", url: "/dashboard/billing", icon: CreditCard },
]

export function DashboardSidebar() {
    const pathname = usePathname()
    const { user } = useAuth()

    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
    

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <Link href="/" className="flex items-center gap-2 px-2 py-1.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600">
                        <Film className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-black tracking-wide group-data-[collapsible=icon]:hidden">
                        FILMRANK
                    </span>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNav.map((item) => (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {accountNav.map((item) => (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {isAdmin && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Admin</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip="Admin panel">
                                        <Link href="/admin/dashboard">
                                            <ShieldCheck />
                                            <span> Admin Panel</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>
        </Sidebar>
    )
}