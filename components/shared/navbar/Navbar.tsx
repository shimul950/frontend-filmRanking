"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Film,
  Heart,
  Search,
  Menu,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ASSUMPTION: adjust these paths to match your actual dashboard routes.
function getDashboardPath(role: string) {
  switch (role) {
    case "SUPER_ADMIN":
      return "/admin/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    default:
      return "/dashboard";
  }
}

export default function Navbar() {
  const router = useRouter();
  const { user, isLoading, logout, isLoggingOut } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-8">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/30">
              <Film className="h-5 w-5 text-white" />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-lg font-black tracking-wide text-white">
                FILMRANK
              </span>
              <span className="text-[10px] uppercase tracking-[4px] text-red-500">
                Cinema Hub
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <Link
                  href="/"
                  className="text-sm font-medium text-white transition hover:text-red-500"
                >
                  Home
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  href="/movies"
                  className="text-sm font-medium text-white transition hover:text-red-500"
                >
                  Movies
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  href="/top-rated"
                  className="text-sm font-medium text-white transition hover:text-red-500"
                >
                  Top Rated
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-white outline-none transition hover:text-red-500">
                    Genres
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="border-white/10 bg-zinc-950 text-white">
                    <DropdownMenuItem>Action</DropdownMenuItem>
                    <DropdownMenuItem>Drama</DropdownMenuItem>
                    <DropdownMenuItem>Comedy</DropdownMenuItem>
                    <DropdownMenuItem>Sci-Fi</DropdownMenuItem>
                    <DropdownMenuItem>Thriller</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* SEARCH BAR */}
        <div className="hidden w-[35%] lg:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

            <Input
              placeholder="Search movies, actors, directors..."
              className="border-white/10 bg-zinc-900 pl-10 text-white placeholder:text-zinc-500 focus-visible:ring-red-500"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">
          {/* THEME TOGGLE */}
          <ModeToggle />

          {/* WISHLIST */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden text-white hover:bg-white/10 hover:text-red-500 md:flex"
          >
            <Heart className="h-5 w-5" />
          </Button>

          {isLoading ? (
            <div className="hidden h-10 w-10 animate-pulse rounded-full bg-zinc-800 md:flex" />
          ) : user ? (
            /* PROFILE DROPDOWN */
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

              <DropdownMenuContent
                align="end"
                className="w-56 border-white/10 bg-zinc-950 text-white"
              >
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-zinc-400">{user.email}</p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem asChild>
                  <Link
                    href={getDashboardPath(user.role)}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10" />

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
          ) : (
            /* LOGIN / SIGNUP */
            <>
              <Link href="/login">
                <Button className="hidden rounded-xl bg-red-600 text-white hover:bg-red-700 md:flex">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="hidden rounded-xl bg-red-600 text-white hover:bg-red-700 md:flex">
                  SignUp
                </Button>
              </Link>
            </>
          )}

          {/* MOBILE MENU */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="border-white/10 bg-black text-white"
            >
              <div className="mt-8 flex flex-col gap-6 mx-5">
                <Link href="/">Home</Link>
                <Link href="/movies">Movies</Link>
                <Link href="/top-rated">Top Rated</Link>
                <Link href="/genres">Genres</Link>

                <div className="pt-4">
                  <Input
                    placeholder="Search..."
                    className="border-white/10 bg-zinc-900"
                  />
                </div>

                {user ? (
                  <>
                    <Link href={getDashboardPath(user.role)}>Dashboard</Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="text-left text-red-500"
                    >
                      {isLoggingOut ? "Logging out…" : "Log out"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login">Login</Link>
                    <Link href="/register">Sign up</Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}