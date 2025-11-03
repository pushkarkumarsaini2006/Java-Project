import { Link, Outlet, useLocation } from "react-router-dom";
import { BookOpen, Library, Moon, Sun, LogOut, User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppLayout() {
  const location = useLocation();
  const [dark, setDark] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/40">
      <header className="sticky top-0 z-40 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/dashboard" className="inline-flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-md bg-emerald-600 text-white shadow-sm">
              <Library className="size-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-tight">LeafStack Library</span>
              <span className="text-xs text-muted-foreground">Modern library management</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              to="/dashboard"
              className={cn(
                "transition-colors hover:text-foreground/80",
                location.pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {user?.role === "admin" ? "Admin Dashboard" : "User Dashboard"}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setDark((v) => !v)}
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    {user.role === "admin" ? <Shield className="size-4" /> : <User className="size-4" />}
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role} Account</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="size-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Outlet />
      </main>

      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} LeafStack Library</p>
          <p className="flex items-center gap-1">
            Built with <span className="text-emerald-600">♥</span> for readers
          </p>
        </div>
      </footer>
    </div>
  );
}
