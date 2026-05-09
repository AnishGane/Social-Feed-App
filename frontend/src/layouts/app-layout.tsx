import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex bg-background">
                <AppSidebar />

                <main className="flex-1">
                    <div className="border-b p-4">
                        <SidebarTrigger />
                    </div>

                    <div className="p-4">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default AppLayout;