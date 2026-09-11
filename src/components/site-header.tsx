import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl gradient-hero text-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">XPLAINA</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium sm:gap-4">
          <Link to="/" className="rounded-md px-2 py-1 text-muted-foreground hover:text-foreground">
            الرئيسية
          </Link>
          <Link
            to="/courses"
            className="rounded-md px-2 py-1 text-muted-foreground hover:text-foreground"
          >
            المواد
          </Link>
          <Button asChild size="sm">
            <Link to="/login">تسجيل الدخول</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} XPLAINA — منصة شرح المواد الجامعية.</p>
        <p>الحسابات تُصدر من إدارة المنصة فقط.</p>
      </div>
    </footer>
  );
}
