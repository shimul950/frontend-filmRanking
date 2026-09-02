"use client"

import {
    LayoutDashboard,
    Users,
    Film,
    Tags,
    MonitorPlay,
    MessageSquareText,
    ArrowLeftRight,
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


// Paths assume this file lives at
// src/app/(dashboardRoute)/admin/dashboard/*-management — adjust the
// base if your routing puts admin pages somewhere else.
const managementNav = [
    { title: "Admin Management", url: "/admin/dashboard/admin-management", icon: Users, superAdminOnly: true },
    { title: "Movie Management", url: "/admin/dashboard/movie-management", icon: Film },
    { title: "Genre Management", url: "/admin/dashboard/genre-management", icon: Tags },
    { title: "Platform Management", url: "/admin/dashboard/platform-management", icon: MonitorPlay },
    { title: "Review Management", url: "/admin/dashboard/review-management", icon: MessageSquareText },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const { user } = useAuth()

    const isSuperAdmin = user?.role === "SUPER_ADMIN"

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <Link href="/admin/dashboard" className="flex items-center gap-2 px-2 py-1.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600">
                        <Film className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-black tracking-wide group-data-[collapsible=icon]:hidden">
                        FILMRANK ADMIN
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
                            {managementNav
                                .filter((item) => !item.superAdminOnly || isSuperAdmin)
                                .map((item) => (
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