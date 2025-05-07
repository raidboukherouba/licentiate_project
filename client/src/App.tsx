import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from '@/components/mode-toggle'

import { LanguageSwitcher } from "@/components/language-switcher"

import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

import React from "react"

export default function Page() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {pathnames.map((value, index) => {
                  const last = index === pathnames.length - 1;
                  const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                
                  return (
                    <React.Fragment key={to}>
                      <BreadcrumbItem>
                        {last ? (
                          <BreadcrumbPage>{value}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={to}>{value}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!last && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 px-4">
            <LanguageSwitcher />
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <ModeToggle />
            </ThemeProvider>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div> */}
          {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"> */}
          <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
