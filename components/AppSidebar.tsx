"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarSeparator,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Package, Users, ShoppingCart, BarChart3, Home, LogOut, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useMe } from "@/hooks/useMe"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const AppSidebar = () => {
    const pathname = usePathname()
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data: me } = useMe()
    const { setTheme } = useTheme()

    const dashboardHref = me?.role && !["admin", "manager"].includes(me.role) ? "/staff-dashboard" : "/"

    const nav = [
        { name: "Dashboard", href: dashboardHref, icon: Home },
        { name: "Products", href: "/products", icon: Package },
        { name: "Staff", href: "/staff", icon: Users },
        { name: "Sales", href: "/sales", icon: ShoppingCart },
        { name: "Reports", href: "/reports", icon: BarChart3 },
    ]

    const filteredNav = nav.filter((item) => {
        // Reports + Staff management are only for admin/manager.
        if ((item.href === "/reports" || item.href === "/staff") && me?.role) {
            return ["admin", "manager"].includes(me.role)
        }
        return true
    })

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
        } finally {
            queryClient.clear()
            toast.success("Logged out")
            router.replace("/signin")
            router.refresh()
        }
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="lg" tooltip="StockTrack">
                            <Link href={dashboardHref}>

                                <span className="font-bold text-2xl">StoreTrack</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredNav.map(({ name, href, icon: Icon }) => (
                                <SidebarMenuItem key={name}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={name}
                                        isActive={
                                            pathname === href ||
                                            (href !== "/" && !!pathname?.startsWith(href))
                                        }
                                    >
                                        <Link href={href} >
                                            <Icon />
                                            <span>{name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarSeparator />
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <Sun className="dark:hidden" />
                                    <Moon className="hidden dark:block" />
                                    <span>Theme</span>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" side="top">
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Logout" onClick={logout}>
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
export default AppSidebar