import { AppSidebar } from "@/components/app-sidebar";

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
                <header className="flex h-16 items-center border-b px-4">
                    <SidebarTrigger />
                </header>

                <main className="min-h-[calc(100vh-64px)] bg-background">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default AppLayout;