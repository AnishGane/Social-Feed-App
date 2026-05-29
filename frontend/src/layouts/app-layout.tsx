import { AppSidebar } from "@/components/app-sidebar";
import NavSearchButton from "@/components/nav-search-button";
import ScrollToTop from "@/components/scroll-to-top";
import SearchModal from "@/components/search/search-modal";
import { SearchShortcut } from "@/components/search/search-shortcut";

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <SidebarProvider>
            <ScrollToTop />
            <AppSidebar />

            <SidebarInset>
                <header className="flex h-16 items-center border-b px-4 justify-between">
                    <SidebarTrigger />
                    <NavSearchButton />
                </header>

                <SearchShortcut />
                <SearchModal />

                <main className="min-h-[calc(100vh-64px)] bg-background">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default AppLayout;