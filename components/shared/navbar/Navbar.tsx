"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Film,
  Heart,
  Search,
  Menu,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Clapperboard,
  Flame,
  Star,
  Compass,
  Bookmark,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { MovieAutocompleteSearch } from "@/components/modules/movies/MovieAutocompleteSearch";
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const GENRES_LIST = [
  { name: "Action", icon: Flame, color: "text-red-500" },
  { name: "Sci-Fi", icon: Sparkles, color: "text-cyan-500" },
  { name: "Drama", icon: Clapperboard, color: "text-amber-500" },
  { name: "Thriller", icon: Compass, color: "text-purple-500" },
  { name: "Animation", icon: Star, color: "text-pink-500" },
  { name: "Comedy", icon: Sparkles, color: "text-emerald-500" },
];

function getDashboardPath(role: string) {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "/admin/dashboard";
    default:
      return "/dashboard";
  }
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout, isLoggingOut } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Movies", href: "/movies" },
    { label: "Web Series", href: "/web-series" },
    { label: "Top Rated", href: "/movies?sort=rating" },
    { label: "Reviews", href: "/reviews" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 max-w-7xl">
        {/* LEFT: LOGO & PRIMARY NAV */}
        <div className="flex items-center gap-6 lg:gap-8">
          {/* LOGO */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/30 transition-transform duration-300 group-hover:scale-105">
              <Film className="h-5 w-5" />
            </div>

            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1">
                <span className="text-lg font-black tracking-tight text-foreground">
                  FILM<span className="text-red-600">RANK</span>
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-[3px] text-muted-foreground font-semibold">
                Cinema Hub
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${isActive
                      ? "text-red-600 dark:text-red-500 bg-red-500/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* GENRES DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 outline-none transition">
                <span>Genres</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-56 p-1.5 border-border bg-popover text-popover-foreground shadow-xl rounded-xl"
              >
                <DropdownMenuLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1">
                  Popular Categories
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                {GENRES_LIST.map((genre) => {
                  const Icon = genre.icon;
                  return (
                    <DropdownMenuItem
                      key={genre.name}
                      asChild
                      className="cursor-pointer rounded-lg px-2.5 py-2 hover:bg-accent focus:bg-accent"
                    >
                      <Link
                        href={`/movies?genre=${encodeURIComponent(genre.name)}`}
                        className="flex items-center justify-between text-xs font-medium w-full"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`h-3.5 w-3.5 ${genre.color}`} />
                          <span>{genre.name}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">Catalog</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* CENTER: AUTOCOMPLETE SEARCH BAR */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <MovieAutocompleteSearch placeholder="Search movies, directors, genres..." />
        </div>

        {/* RIGHT: CONTROLS & AUTH */}
        <div className="flex items-center gap-2">
          {/* THEME TOGGLE */}
          <ModeToggle />

          {/* QUICK MOVIES SHORTCUT */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="hidden sm:flex text-muted-foreground hover:text-red-600 hover:bg-muted/60 rounded-xl"
            title="Explore Movies"
          >
            <Link href="/movies">
              <Film className="h-4 w-4" />
            </Link>
          </Button>

          {/* WISHLIST SHORTCUT */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-amber-500 hover:bg-muted/60 rounded-xl"
            title="My Wishlist"
          >
            <Link href="/wishlist">
              <Bookmark className="h-4 w-4" />
            </Link>
          </Button>

          {/* AUTH SECTION */}
          {isLoading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            /* LOGGED-IN PROFILE DROPDOWN */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-border hover:ring-red-500/50 transition outline-none"
                  aria-label="User menu"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback className="bg-red-600 text-xs font-bold text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 p-1.5 border-border bg-popover text-popover-foreground shadow-2xl rounded-xl"
              >
                <DropdownMenuLabel className="p-2 font-normal">
                  <p className="text-xs font-bold text-foreground">{user.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400">
                    {user.role}
                  </span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuItem asChild className="rounded-lg text-xs font-medium cursor-pointer">
                  <Link
                    href={getDashboardPath(user.role)}
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="rounded-lg text-xs font-medium cursor-pointer">
                  <Link href="/movies" className="flex items-center gap-2">
                    <Clapperboard className="h-4 w-4 text-muted-foreground" />
                    Cinema Catalog
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="rounded-lg text-xs font-medium cursor-pointer">
                  <Link href="/wishlist" className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-amber-500" />
                    My Wishlist
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="rounded-lg text-xs font-medium cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* GUEST AUTH BUTTONS: Sign In (ghost) + Get Started (primary) */
            <div className="flex items-center gap-1.5">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground h-9 px-3 rounded-xl"
              >
                <Link href="/login">Sign In</Link>
              </Button>

              <Button
                asChild
                size="sm"
                className="text-xs font-semibold bg-red-600 hover:bg-red-700 text-white h-9 px-3.5 rounded-xl shadow-md shadow-red-600/25 transition-transform hover:scale-[1.02]"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}

          {/* MOBILE HAMBURGER MENU */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-muted-foreground hover:text-foreground rounded-xl"
                aria-label="Open mobile menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-80 p-6 border-border bg-background text-foreground flex flex-col justify-between"
            >
              <div className="space-y-6">
                <SheetHeader className="text-left p-0">
                  <SheetTitle className="flex items-center gap-2 text-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
                      <Film className="h-4 w-4" />
                    </div>
                    <span className="text-base font-black">FILMRANK</span>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Autocomplete Search */}
                <div className="relative">
                  <MovieAutocompleteSearch
                    placeholder="Search catalog..."
                    onItemSelect={() => setIsMobileMenuOpen(false)}
                  />
                </div>

                {/* Mobile Nav Links */}
                <div className="flex flex-col space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Navigation
                  </span>
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Genres */}
                <div className="flex flex-col space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Top Genres
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    {GENRES_LIST.map((g) => (
                      <Link
                        key={g.name}
                        href={`/movies?genre=${encodeURIComponent(g.name)}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition"
                      >
                        {g.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Auth & Footer */}
              <div className="pt-6 border-t border-border space-y-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-red-600 text-xs text-white font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold truncate">{user.name}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
                      </div>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full text-xs rounded-xl"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href={getDashboardPath(user.role)}>Dashboard</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full text-xs rounded-xl flex items-center justify-center gap-1.5"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/wishlist">
                        <Bookmark className="h-3.5 w-3.5 text-amber-500" />
                        My Wishlist
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full text-xs rounded-xl"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-xl"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="text-xs rounded-xl bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/register">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}