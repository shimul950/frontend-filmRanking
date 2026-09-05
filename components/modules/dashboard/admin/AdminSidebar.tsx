"use client"

import {
    LayoutDashboard,
    Users,
    Film,
    Tags,
    MonitorPlay,
    MessageSquareText,
    ArrowLeftRight,
    ChevronRight,
    UserPlus,
    List,
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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useAuth } from "@/hooks/useAuth"

const managementNav = [

    { title: "Movie Management", url: "/admin/dashboard/movie-management", icon: Film },
    { title: "Genre Management", url: "/admin/dashboard/genre-management", icon: Tags },
    { title: "Platform Management", url: "/admin/dashboard/platform-management", icon: MonitorPlay },
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
                <Link href="/admin/dashboard" className="flex items-center gap-2 px-2 py-1.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600">
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
                            {/* Admin Management — SUPER_ADMIN only, collapsible */}
                            {isSuperAdmin && (
                                <Collapsible
                                    defaultOpen={pathname.startsWith("/admin/dashboard/admin-management")}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip="Admin Management">
                                                <Users />
                                                <span>Admin Management</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={pathname === "/admin/dashboard/admin-management"}
                                                    >
                                                        <Link href="/admin/dashboard/admin-management">
                                                            <List className="size-4" />
                                                            <span>All Admins</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={pathname === "/admin/dashboard/admin-management?create=true"}
                                                    >
                                                        <Link href="/admin/dashboard/admin-management?create=true">
                                                            <UserPlus className="size-4" />
                                                            <span>Create Admin</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            )}

                            {/* Everything else — flat links, unaffected by the collapsible above */}
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