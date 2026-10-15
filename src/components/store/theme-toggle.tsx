import { Moon, Sun } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next = !dark;
    const root = document.documentElement;
    root.style.setProperty("--tx", `${e.clientX}px`);
    root.style.setProperty("--ty", `${e.clientY}px`);
    const apply = () => {
      root.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      setDark(next);
    };
    const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (d.startViewTransition) d.startViewTransition(apply);
    else apply();
  };

  return (
    <Button size="icon" variant="ghost" onClick={toggle} aria-label="تبديل الوضع" className="relative overflow-hidden">
      <Sun className={`size-5 transition-all duration-500 ${dark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
      <Moon className={`absolute size-5 transition-all duration-500 ${dark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`} />
    </Button>
  );
}
