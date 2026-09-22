"use client"

import {
    LayoutDashboard,
    Users,
    Film,
    UserCheck,
    Video,
    Tv,
    Tags,
    Tag,
    MonitorPlay,
    MessageSquareText,
    ArrowLeftRight,
    SlidersHorizontal,
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

const managementNav = [
    { title: "Movie Management", url: "/admin/dashboard/movie-management", icon: Film },
    { title: "Banner Management", url: "/admin/dashboard/banner-management", icon: SlidersHorizontal },
    { title: "Cast Management", url: "/admin/dashboard/cast-management", icon: UserCheck },
    { title: "Director Management", url: "/admin/dashboard/director-management", icon: Video },
    { title: "Web Series Management", url: "/admin/dashboard/web-series-management", icon: Tv },
    { title: "Genre Management", url: "/admin/dashboard/genre-management", icon: Tags },
    { title: "Platform Management", url: "/admin/dashboard/platform-management", icon: MonitorPlay },
    { title: "Tag Management", url: "/admin/dashboard/tag-management", icon: Tag },
    { title: "Review Management", url: "/admin/dashboard/review-management", icon: MessageSquareText },
    { title: "User Management", url: "/admin/dashboard/user-management", icon: Users },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const { user } = useAuth()

    const isSuperAdmin = user?.role === "SUPER_ADMIN"

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <Link href="/home" className="flex items-center gap-2 px-2 py-1.5" title="Go to Cinema Home">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600 transition-transform hover:scale-105">
                        <Film className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-black tracking-wide group-data-[collapsible=icon]:hidden">
                        {isSuperAdmin ? "SUPER ADMIN" : "ADMIN"} PANEL
                    </span>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Overview</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === "/admin/dashboard"}
                                    tooltip="Dashboard"
                                >
                                    <Link href="/admin/dashboard">
                                        <LayoutDashboard />
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {isSuperAdmin && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname.startsWith("/admin/dashboard/admin-management")}
                                        tooltip="Admin Management"
                                    >
                                        <Link href="/admin/dashboard/admin-management">
                                            <Users />
                                            <span>Admin Management</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}

                            {managementNav.map((item) => (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname.startsWith(item.url)}
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
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Back to site">
                                    <Link href="/dashboard">
                                        <ArrowLeftRight />
                                        <span>Back to user dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}