// import { GalleryVerticalEnd } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from '@/components/mode-toggle'
import { LanguageSwitcher } from "./language-switcher"
import { useState, useEffect } from 'react';

export function Navbar() {
  const [src, setSrc] = useState("./logo-default-mode.svg");

  // Detect theme manually
  useEffect(() => {
    const updateImage = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setSrc(isDarkMode ? "./logo-dark-mode.svg" : "./logo-default-mode.svg");
    };

    updateImage(); // Run on mount
    const observer = new MutationObserver(updateImage);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="w-full">
      <div className="container mx-auto flex items-center justify-between py-1 px-3">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            {/* <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div> */}
            <img
              className="h-6 w-6 transition duration-800 ease-in-out transform hover:rotate-720 hover:scale-110 cursor-pointer"
              src={src}
              alt="logo"
            />
            Lab Flow
          </a>
        </div>
        <div className="flex items-center gap-2 px-4">
          <LanguageSwitcher/>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ModeToggle />
          </ThemeProvider>
        </div>
        
      </div>
    </nav>
  )
}